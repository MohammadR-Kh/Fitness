const express = require('express');
const router = express.Router();
const Workout = require('../models/workouts');

router.get('/:userId', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.status(200).json(workouts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', async (req, res) => {
  const { userId, exerciseName, sets, reps, weight, duration } = req.body;

  try {
    const newWorkout = new Workout({
      userId,
      exerciseName,
      sets,
      reps,
      weight,
      duration,
    });

    const workout = await newWorkout.save();
    res.status(201).json(workout);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedWorkout = await Workout.findByIdAndDelete(id);
    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.status(200).json({ message: 'Workout deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
