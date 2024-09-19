const mongoose = require('mongoose');

const DietSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  mealName: { type: String, required: true },
  foodName: { type: String, required: true },
  amount: { type: Number, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, required: true },
  carbs: { type: Number, required: true },
  fats: { type: Number, required: true },
}, { timestamps: true }); 

module.exports = mongoose.model('Diet', DietSchema);
