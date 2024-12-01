const mongoose = require('mongoose');


const logSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true, 
  },
  date: {
    type: Date,
    default: Date.now, 
    required: true,
  },
  activity: {
    type: String,
    required: true, 
  },
  duration: {
    type: Number,
    required: true, 
  },
  caloriesBurned: {
    type: Number,
    default: 0, 
  },
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
