import { useEffect, useState } from "react";
import Cookies from "js-cookie"; // To get the logged-in user's data

const Dashboard = () => {
  const [name, setName] = useState("");
  const [weight, setWeight] = useState(null);
  const [height, setHeight] = useState(null);
  const [bmi, setBmi] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const [summary, setSummary] = useState({ calories: 0, protein: 0, carbs: 0, fats: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCookie = Cookies.get('user');
        if (userCookie) {
          const { userId } = JSON.parse(userCookie);
          const [userResponse, summaryResponse] = await Promise.all([
            fetch(`http://localhost:5000/api/users/${userId}`),
            fetch(`http://localhost:5000/api/diets/summary/${userId}`)
          ]);

          const userData = await userResponse.json();
          const summaryData = await summaryResponse.json();

          setName(userData.fullname);
          setWeight(userData.weight);
          setHeight(userData.height);
          setSummary(summaryData); // Set the total nutrient summary

          if (userData.weight && userData.height) {
            const bmiValue = (userData.weight / (userData.height * userData.height)) * 10000;
            setBmi(bmiValue.toFixed(2));
            setIsEditing(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getBmiClass = (bmi) => {
    if (bmi < 18.5) {
      return "yellow"; 
    } else if (bmi >= 18.5 && bmi < 24.9) {
      return "green";   
    } else if (bmi >= 25 && bmi < 29.9) {
      return "orange";  
    } else if (bmi >= 30) {
      return "red";     
    }
  };
  

  const handleSubmit = async () => {
    const userCookie = Cookies.get('user');
    if (userCookie) {
      const { userId } = JSON.parse(userCookie);
      try {
        const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ weight, height }),
        });
        const data = await response.json();
        setBmi(((weight / (height * height)) * 10000).toFixed(2)); 
        setIsEditing(false); 
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  return (
    <div className="dashboard">
      <div className="dash-head">
        <h2>Welcome {name}</h2>
      </div>
      <div className="health-sum">
        <div className="health-val">
          Weight: {isEditing ? (
            <input 
              type="number" 
              value={weight || ''} 
              onChange={(e) => setWeight(e.target.value)} 
              placeholder="Weight" 
            />
          ) : (
            <span>{weight} kg</span>
          )}
        </div>
        <div className="health-val">
          Height: {isEditing ? (
            <input 
              type="number" 
              value={height || ''} 
              onChange={(e) => setHeight(e.target.value)} 
              placeholder="Height" 
            />
          ) : (
            <span>{height} cm</span>
          )}
        </div>
        <div className="health-val">
          BMI: {bmi ? (
            <span className={`bmi-val ${getBmiClass(bmi)}`}>{bmi}</span>
          ) : 'Not calculated yet'}
        </div>
      </div>
      {isEditing && (
      <div className="button-container">
        <button onClick={handleSubmit}>Save</button>
      </div>
      )}
      <div className="total-diet">
        <div className="health-val">
          Calories: <span> {summary.calories} kcal</span>
        </div>
          <div className="health-val">
          Protein: <span> {summary.protein} g</span>
        </div>
        <div className="health-val">
          Carbs: <span> {summary.carbs} g</span>
        </div>
        <div className="health-val">
          Fats: <span> {summary.fats} g</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;