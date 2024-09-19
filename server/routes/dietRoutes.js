const express = require('express');
const router = express.Router();
const Diet = require('../models/diet');

router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const diet = await Diet.find({ userId });
    res.status(200).json(diet);
  } catch (error) {
    res.status(500).json({ msg: 'Error fetching diet data' });
  }
});

router.post('/', async (req, res) => {
  const { userId, mealName, foodName, amount, calories, protein, carbs, fats } = req.body;

  try {
    const newDiet = new Diet({
      userId,
      mealName,
      foodName,
      amount,
      calories,
      protein,
      carbs,
      fats
    });

    const savedDiet = await newDiet.save();
    res.status(201).json(savedDiet);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ msg: 'Error adding diet entry' });
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteDiet = await Diet.findByIdAndDelete(id);
    if (!deleteDiet) {
      return res.status(404).json({ message: 'Diet not found' });
    }
    res.status(200).json({ message: 'Diet deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Diet Error' });
  }
});
router.get('/summary/:userId', async (req, res) => {
  const { userId } = req.params;
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  try {

    const meals = await Diet.find({
      userId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalSummary = meals.reduce(
      (total, meal) => {
        total.calories += parseFloat(meal.calories);
        total.protein += parseFloat(meal.protein);
        total.carbs += parseFloat(meal.carbs);
        total.fats += parseFloat(meal.fats);
        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    res.status(200).json(totalSummary);
  } catch (error) {
    res.status(500).json({ msg: 'Error calculating nutrients for the day' });
  }
});



module.exports = router;
