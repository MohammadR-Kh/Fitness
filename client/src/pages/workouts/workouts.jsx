import {useForm} from "react-hook-form";
import * as yup from 'yup';
import {yupResolver} from "@hookform/resolvers/yup"
import { useState, useEffect} from "react";
import Cookies from "js-cookie";

const Workouts = () => {

  const [workouts, setWorkouts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const schema = yup.object().shape({
    exerciseName: yup.string().required("Exercise Name is Required!"),
    sets: yup.number("Sets Must be a Number!").required("Sets are Required!").typeError("Sets are Required!"),
    reps: yup.number("Reps Must be a Number!").required("Reps are Required!").typeError("Reps are Required!"),
    weight: yup.number("Weight Must be a Number!").typeError("Weight is Required!"),
    duration: yup.number("Duration Must be a Number!").typeError("Duration is Required!"),
  });

  const { register, handleSubmit, formState:{errors}} = useForm({resolver: yupResolver(schema)});

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const userCookie = Cookies.get('user');
        const { userId } = JSON.parse(userCookie);

        const response = await fetch(`http://localhost:5000/api/workouts/${userId}`);
        const result = await response.json();

        if (response.ok) {
          setWorkouts(result);
        } else {
          console.error('Error fetching workouts:', result.msg);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchWorkouts();
  }, []);

  const deleteWorkout = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this workout?");
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setWorkouts(workouts.filter((workout) => workout._id !== id));
      } else {
        console.error('Failed to delete workout');
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };
  

  const AddWorkout = ({onClose}) => {
    
    const onSubmit = async (data) => {
      try {
        const userCookie = Cookies.get('user');
        const { userId } = JSON.parse(userCookie);
  
        const workoutData = { ...data, userId };
  
        const response = await fetch("http://localhost:5000/api/workouts", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(workoutData),
        });
        
        const result = await response.json();
  
        if (response.ok) {
          setWorkouts((prevWorkouts => [...prevWorkouts, result]))
          setIsFormVisible(false);

        } else {
          console.error('Error:', result.msg);
        }
      } catch (error) {
        console.log('Error:', error);
      }
    }

    return(
      <div className="overlay">
        <form onSubmit={handleSubmit(onSubmit)} className="add-workout" >
          <h2>Exercise:</h2>
          <input type="text" placeholder="Exercise" {...register("exerciseName")}/>
          <p className="err-workout">{errors.exerciseName?.message}</p>
          <h2>Sets:</h2>
          <input type="number" placeholder="Sets" {...register("sets")} />
          <p className="err-workout">{errors.sets?.message}</p>
          <h2>Reps:</h2>
          <input type="number" placeholder="Reps" {...register("reps")} />
          <p className="err-workout">{errors.reps?.message}</p>
          <h2>Weight:</h2>
          <input type="number" placeholder="Weight" {...register("weight")} />
          <p className="err-workout">{errors.weight?.message}</p>
          <h2>Duration:</h2>
          <input type="number" placeholder="Duration" {...register("duration")} />
          <p className="err-workout">{errors.duration?.message}</p>
          <button type="submit" className="add-but">Add</button>
          <button onClick={onClose} className="cancel-but">Cancel</button>
        </form>
      </div>
    )
  }


  return(
    <div className="workout">
      <div className="workout-head">
        <h2>Workouts:</h2>
        <button onClick={() => setIsFormVisible(true)}className="add-workout-but" >+Add</button>
        {isFormVisible && <AddWorkout onClose={() => setIsFormVisible(false)} />}
      </div>
      <div className="workout-list">
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div key={workout._id} className="workout-item">
              <div className="workout-item-head">
                <h3>{workout.exerciseName}</h3>
                <button className="workout-delete" onClick={() => deleteWorkout(workout._id)} >Delete</button>
              </div>
              <p>Sets: {workout.sets}</p>
              <p>Reps: {workout.reps}</p>
              <p>Weight: {workout.weight} kg</p>
              <p>Duration: {workout.duration} minutes</p>
            </div>
          ))
        ) : (
          <p>No workouts found</p>
        )}
      </div>
    </div>
  )
};

export default Workouts;