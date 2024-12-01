const mongoose = require('mongoose');
const { Schema } = mongoose;


const LogSchema = new Schema({
  amount: {
    type: Number,
    required: true 
  },
  date: {
    type: Date,
    default: Date.now 
  },
  caloriesBurned: {
    type: Number, 
    required: false,
    default: 0 
  }
});


const ChallengeSchema = new Schema({
  name: {
    type: String,
    required: true 
  },
  goal: {
    type: Number,
    required: true 
  },
  progress: {
    type: Number,
    default: 0 
  },
  description: {
    type: String,
    required: true 
  },
  logs: [LogSchema], 
  caloriesPerUnit: {
    type: Number, 
    required: false,
    default: 0 
  }
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
