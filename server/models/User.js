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
    select: false, // Don't include in queries by default
    minlength: 6,
  },
 fitnessGoal: {
  type: String,
  enum: ['weight_loss', 'muscle_gain', 'endurance', 'strength', 'general_fitness'],
  default: 'general_fitness'
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
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Validate password exists
    if (!this.password) {
      throw new Error('Password is required');
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(12); // Increased from 10 to 12 for better security
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method with better error handling
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    // Validate inputs
    if (!enteredPassword) {
      console.error('No password provided for comparison');
      return false;
    }

    if (!this.password) {
      console.error('User password is missing from database');
      return false;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(enteredPassword, this.password);
    return isMatch;
  } catch (error) {
    console.error('Error in password comparison:', error);
    return false;
  }
};

// Method to get user without password
userSchema.methods.toPublicJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Index for faster email lookups
userSchema.index({ email: 1 });

// Virtual for full name (if you want to add firstName/lastName later)
userSchema.virtual('profile').get(function () {
  return {
    name: this.name,
    email: this.email,
    fitnessGoal: this.fitnessGoal,
    age: this.age,
    weight: this.weight,
    height: this.height,
    activityLevel: this.activityLevel,
    notifications: this.notifications,
  };
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model('User', userSchema);