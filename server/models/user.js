const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {type: String, required: true},
  username: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  weight: {type: Number},
  height: {type: Number},
  workouts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Workout' }],
  diets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Diet' }],
  goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
});

module.exports = mongoose.model('User', userSchema);