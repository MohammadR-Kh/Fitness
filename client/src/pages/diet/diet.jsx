import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import foodData from '../../assets/foodDtabase.json';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Cookies from 'js-cookie';

const Diet = () => {
  const [selectedFood, setSelectedFood] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    const fetchDietData = async () => {
      try {
        const userCookie = Cookies.get('user');
        const { userId } = JSON.parse(userCookie);

        const response = await fetch(`http://localhost:5000/api/diets/${userId}`);
        if (response.ok) {
          const dietData = await response.json();
          setMeals(dietData);
        } else {
          console.error('Error fetching diet data:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDietData();
  }, []); 

 
  const schema = yup.object().shape({
    mealName: yup.string().required('Meal Name is Required!'),
    amount: yup
      .number('Amount Must be a Number!')
      .required('Amount is Required!')
      .positive('Amount must be greater than zero')
      .typeError('Amount is Required!'),
    selectedFood: yup.mixed().required('Please select a food!'),
  });

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const options = foodData.map((food) => ({
    label: food.name,
    value: food.id,
  }));

  const handleFoodSelect = (selectedOption) => {
    setSelectedFood(selectedOption);
    setValue('selectedFood', selectedOption);
  };
  const deleteDiet = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this meal?");
    if (!isConfirmed) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/diets/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setMeals(meals.filter((meal) => meal._id !== id));
      } else {
        console.error('Failed to delete diet');
      }
    } catch (error) {
      console.error('Error deleting diet:', error);
    }
  };

  const AddFood = ({ onClose }) => {
    const onSubmit = async (data) => {
      if (!selectedFood) {
        console.error('Please select a food.');
        return;
      }

      const selectedNutrition = foodData.find((food) => food.id === selectedFood.value);

      if (!selectedNutrition) return;

    
      const amountMultiplier = data.amount;
      const calculatedMeal = {
        mealName: data.mealName,
        foodName: selectedNutrition.name,
        amount: amountMultiplier,
        calories: (selectedNutrition.calories * amountMultiplier).toFixed(2),
        protein: (selectedNutrition.protein * amountMultiplier).toFixed(2),
        carbs: (selectedNutrition.carbs * amountMultiplier).toFixed(2),
        fats: (selectedNutrition.fats * amountMultiplier).toFixed(2),
      };

      try {
        const userCookie = Cookies.get('user');
        const { userId } = JSON.parse(userCookie);

        const response = await fetch('http://localhost:5000/api/diets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...calculatedMeal, userId }),
        });

        if (response.ok) {
          const savedMeal = await response.json();
          setMeals([...meals, savedMeal]); 
          setIsFormVisible(false);
          reset();
        } else {
          console.error('Error saving meal:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    return (
      <div className='overlay-diet'>
        <form onSubmit={handleSubmit(onSubmit)} className='add-meal'>
          <h2>Meal Name:</h2>
          <input placeholder='Meal Name' type='text' {...register('mealName')} />
          <p className='err-diet'>{errors.mealName?.message}</p>
          <h2>Food</h2>
          <Select
            classNamePrefix="select"
            value={selectedFood}
            options={options}
            onChange={handleFoodSelect}
            placeholder="Select a food"
            styles={{
              container: (baseStyles) => ({
                ...baseStyles,
                width: '422px',
                
              }),
              control: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#333333',
                color: '#ffffff',
                border: '1px solid #39ff14',
                padding: '5px',
                borderRadius: '5px',
                marginBottom: "5px",
                width: '422px',
                boxShadow: '0 0 10px 2px transparent',
                '&:hover': {
                  borderColor: '#2ecc71',
                  boxShadow: '0 0 10px 2px #2ecc71',
                },
              }),
              menu: (baseStyles) => ({
                ...baseStyles,
                backgroundColor: '#333333',
                color: '#ffffff',
              }),
              option: (baseStyles, { isFocused }) => ({
                ...baseStyles,
                backgroundColor: isFocused ? '#2ecc71' : '#333333',
                color: isFocused ? '#000000' : '#ffffff',
              }),
              singleValue: (baseStyles) => ({
                ...baseStyles,
                color: '#ffffff',
              }),
            }}
          />
          <p className='err-diet'>{errors.selectedFood?.message}</p>
          <h2>Amount (100g):</h2>
          <input placeholder='Amount' type='number' step="any" {...register('amount')} />
          <p className='err-diet'>{errors.amount?.message}</p>
          <button type="submit" className="add-but">Add</button>
          <button onClick={onClose} className="cancel-but">Cancel</button>
        </form>
      </div>
    );
  };

  return (
    <div className='diet'>
      <div className='diet-head'>
        <h2>Diet:</h2>
        <button onClick={() => setIsFormVisible(true)} className='add-meal-but'>+Add</button>
        {isFormVisible && <AddFood onClose={() => setIsFormVisible(false)} />}
      </div>
      <div className="meal-list">
        {meals.length > 0 ? (
          meals.map((meal, index) => (
            <div key={index} className="meal-item">
              <div className='meal-item-head'>
              <h3>{meal.mealName}</h3>
              <button className='meal-delete' onClick={() => deleteDiet(meal._id)}>Delete</button>
              </div>
              <p>Food: {meal.foodName}</p>
              <p>Amount: {meal.amount * 100}g</p>
              <p>Calories: {meal.calories}</p>
              <p>Protein: {meal.protein}g</p>
              <p>Carbs: {meal.carbs}g</p>
              <p>Fats: {meal.fats}g</p>
            </div>
          ))
        ) : (
          <p>No meals added yet.</p>
        )}
      </div>
    </div>
  );
};

export default Diet;
