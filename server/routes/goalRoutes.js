const express = require("express");
const router = express.Router();
const Goal = require("../models/goal");

router.post("/add", async (req, res) => {
  const { userId, goalType, targetValue, currentValue, status } = req.body;

  try {
    const newGoal = new Goal({
      userId,
      goalType,
      targetValue,
      currentValue,
      status
    });

    await newGoal.save(); // Save the new goal to the database
    res.status(201).json({ message: "Goal added successfully", goal: newGoal });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    console.log(error);
  }
});


router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const goals = await Goal.find({ userId });
    res.status(200).json(goals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
    
  }
});

module.exports = router;
