const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  exercises: [{
    exercise: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Exercise'
    },
    sets: Number,
    reps: Number,
    weight: Number,
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    caloriesBurned: {
      type: Number,
      default: 0,
      min: 0
    }
  }],
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Workout', workoutSchema);