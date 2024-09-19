const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  goalType: {
    type: String,
    enum: ['Weight Loss', 'Gain Weight', 'Maintain'],
    required: true},
  targetValue: {type: Number, required: true},
  currentValue: {type: Number, required: true},
  status: {
    type: String,
    enum: ['In Progress', 'Achieved', 'Failed'],
    
  }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);