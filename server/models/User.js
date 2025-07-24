const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  fitnessGoal: {
    type: String,
    enum: ['weight_loss', 'muscle_gain', 'endurance', 'strength', 'general_fitness', ''],
    default: '',
  },
  age: {
    type: Number,
    min: 13,
    max: 120,
  },
  weight: {
    type: Number,
    min: 20,
    max: 500,
  },
  height: {
    type: Number,
    min: 100,
    max: 250,
  },
  activityLevel: {
    type: String,
    enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
    default: 'moderate',
  },
  notifications: {
    workoutReminders: { type: Boolean, default: true },
    nutritionTips: { type: Boolean, default: true },
    progressUpdates: { type: Boolean, default: true },
    emailUpdates: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);