import {useForm} from "react-hook-form";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import { useState, useEffect} from "react";
import Cookies from "js-cookie";

const Goals = () => {

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [goals, setGoals] = useState([]);

  const schema = yup.object().shape({
    goalType: yup.string().required("Select a Type!"),
    targetValue: yup.number("Target Must be a Number!").required().typeError("Set a Taget!"),
    currentValue: yup.number("Current Must be a Number!").required().typeError("Set a Current!"),
    status: yup.string().required("Select a Status!")
  });

  const {register, handleSubmit, formState: {errors}, reset} = useForm({resolver: yupResolver(schema)});

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const userCookie = Cookies.get('user');
        const { userId } = JSON.parse(userCookie);

        const response = await fetch(`http://localhost:5000/api/goals/${userId}`);
        const result = await response.json();
        
        if (response.ok) {
          setGoals(result);
        } else {
          console.error('Error fetching workouts:', result.msg);
        }
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };

    fetchGoals();
  }, []);


  const AddGoal = ({onClose}) => {

    const onSubmit = async (data) => {
      try {
        const userCookie = Cookies.get('user');
        const { userId } = JSON.parse(userCookie);

        const response = await fetch('http://localhost:5000/api/goals/add', {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...data, userId })
        });

        if (response.ok) {
          const result = await response.json();
          setGoals([...goals, result.goal]); 
          reset(); 
          setIsFormVisible(false);
        } else {
          console.error("Error adding goal:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding goal:", error);
      }
    };


    return(
      <div className="goal-overlay">
        <form onSubmit={handleSubmit(onSubmit)} className="add-goal">
          <h2>Goal Type:</h2>
          <select {...register("goalType")}>
            <option value="Weight Loss">Weight Loss</option>
            <option value="Gain Weight">Gain Weight</option>
            <option value="Maintain">Maintain</option>
          </select>
          <p className="goal-err">{errors.goalType?.message}</p>
          <h2>Target:</h2>
          <input type="number" placeholder="Target" {...register("targetValue")} />
          <p className="goal-err">{errors.targetValue?.message}</p>
          <h2>Current:</h2>
          <input type="number" placeholder="Current" {...register("currentValue")} />
          <p className="goal-err">{errors.currentValue?.message}</p>
          <h2>Status:</h2>
          <select {...register("status")}>
            <option value="In Progress">In Progress</option>
            <option value="Achieved">Achieved</option>
            <option value="Failed">Failed</option>
          </select>
          <p className="goal-err">{errors.status?.message}</p>
          <button type="submit" className="add-but">Add</button>
          <button onClick={onClose} className="cancel-but">Cancel</button>
        </form>
      </div>
    )
  }


  return(
    <div className="goal">
      <div className="goal-head">
        <h2>Goals:</h2>
        <button onClick={() => setIsFormVisible(true)}className="add-goal-but" >+Add</button>
        {isFormVisible && <AddGoal onClose={() => setIsFormVisible(false)} />}
      </div>
      <div className="goal-list">
        {goals.map((goal, index) => (
          <div key={index} className="goal-item">
            <div className="goal-item-head">
              <button className="goal-edit">Edit</button>
              <h3>{goal.goalType}</h3>
              <button className="goal-delete">Delete</button>
            </div>
            <p>Target: {goal.targetValue} kg</p>
            <p>Current: {goal.currentValue} kg</p>
            <p>Status: {goal.status}</p>
          </div>
        ))}
      </div>
    </div>
  )
};

export default Goals;