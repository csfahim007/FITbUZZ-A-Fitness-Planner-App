const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc Get all workouts for logged in user
// @route GET /api/workouts
// @access Private
exports.getWorkouts = asyncHandler(async (req, res) => {
  console.log('Getting workouts for user:', req.user.id);
  
  try {
    const workouts = await Workout.find({ user: req.user.id }).populate('exercises.exercise');
    
    const workoutsWithCalories = workouts.map(workout => {
      const totalCalories = workout.exercises.reduce((sum, ex) => {
        return sum + (ex.exercise?.caloriesPerRep * ex.sets * ex.reps || 0);
      }, 0);
      return { ...workout._doc, totalCalories };
    });
    
    console.log('Found workouts:', workoutsWithCalories.length);
    res.status(200).json({ success: true, count: workoutsWithCalories.length, data: workoutsWithCalories });
  } catch (error) {
    console.error('Error fetching workouts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch workouts',
      error: error.message 
    });
  }
});

// @desc Get single workout
// @route GET /api/workouts/:id
// @access Private
exports.getWorkout = asyncHandler(async (req, res) => {
  console.log('Getting workout:', req.params.id);
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format'
      });
    }

    const workout = await Workout.findById(req.params.id).populate('exercises.exercise');

    if (!workout) {
      console.log('Workout not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    if (workout.user.toString() !== req.user.id) {
      console.log('Unauthorized access attempt for workout:', req.params.id);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this workout'
      });
    }

    const totalCalories = workout.exercises.reduce((sum, ex) => {
      return sum + (ex.exercise?.caloriesPerRep * ex.sets * ex.reps || 0);
    }, 0);

    res.status(200).json({ success: true, data: { ...workout._doc, totalCalories } });
  } catch (error) {
    console.error('Error fetching workout:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch workout',
      error: error.message 
    });
  }
});

// @desc Create new workout
// @route POST /api/workouts
// @access Private
exports.createWorkout = asyncHandler(async (req, res) => {
  console.log('Creating workout with data:', req.body);
  
  try {
    const { name, exercises } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a workout name'
      });
    }

    // Validate exercises if provided
    if (exercises && exercises.length > 0) {
      for (let ex of exercises) {
        if (!ex.exercise) {
          return res.status(400).json({
            success: false,
            message: 'Each exercise must have an exercise ID'
          });
        }
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(ex.exercise)) {
          return res.status(400).json({
            success: false,
            message: `Invalid exercise ID format: ${ex.exercise}`
          });
        }
        
        // Check if exercise exists and belongs to user
        const exerciseExists = await Exercise.findOne({ 
          _id: ex.exercise, 
          user: req.user.id 
        });
        
        if (!exerciseExists) {
          return res.status(400).json({
            success: false,
            message: `Exercise ${ex.exercise} not found or not accessible`
          });
        }
      }
    }

    const workout = await Workout.create({
      user: req.user.id,
      name,
      exercises: exercises || []
    });

    const populatedWorkout = await Workout.findById(workout._id).populate('exercises.exercise');
    const totalCalories = populatedWorkout.exercises.reduce((sum, ex) => {
      return sum + (ex.exercise?.caloriesPerRep * ex.sets * ex.reps || 0);
    }, 0);

    console.log('Workout created:', populatedWorkout);
    res.status(201).json({ success: true, data: { ...populatedWorkout._doc, totalCalories } });
  } catch (error) {
    console.error('Error creating workout:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Workout with this name already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create workout',
      error: error.message 
    });
  }
});

// @desc Update workout
// @route PUT /api/workouts/:id
// @access Private
exports.updateWorkout = asyncHandler(async (req, res) => {
  console.log('Updating workout:', req.params.id, req.body);
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format'
      });
    }

    let workout = await Workout.findById(req.params.id);

    if (!workout) {
      console.log('Workout not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    if (workout.user.toString() !== req.user.id) {
      console.log('Unauthorized update attempt for workout:', req.params.id);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this workout'
      });
    }

    // If updating exercises, validate them
    if (req.body.exercises) {
      for (let ex of req.body.exercises) {
        if (ex.exercise) {
          // Validate ObjectId format
          if (!mongoose.Types.ObjectId.isValid(ex.exercise)) {
            return res.status(400).json({
              success: false,
              message: `Invalid exercise ID format: ${ex.exercise}`
            });
          }
          
          const exerciseExists = await Exercise.findOne({ 
            _id: ex.exercise, 
            user: req.user.id 
          });
          
          if (!exerciseExists) {
            return res.status(400).json({
              success: false,
              message: `Exercise ${ex.exercise} not found or not accessible`
            });
          }
        }
      }
    }

    // Remove undefined fields from req.body
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    });

    workout = await Workout.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    }).populate('exercises.exercise');

    const totalCalories = workout.exercises.reduce((sum, ex) => {
      return sum + (ex.exercise?.caloriesPerRep * ex.sets * ex.reps || 0);
    }, 0);

    console.log('Workout updated:', workout);
    res.status(200).json({ success: true, data: { ...workout._doc, totalCalories } });
  } catch (error) {
    console.error('Error updating workout:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Workout with this name already exists'
      });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update workout',
      error: error.message 
    });
  }
});

// @desc Delete workout
// @route DELETE /api/workouts/:id
// @access Private
exports.deleteWorkout = asyncHandler(async (req, res) => {
  console.log('Deleting workout:', req.params.id);
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid workout ID format'
      });
    }

    const workout = await Workout.findById(req.params.id);
    const exerciseObjectId = new mongoose.Types.ObjectId(req.params.id);

    if (!workout) {
      console.log('Workout not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Workout not found'
      });
    }

    if (workout.user.toString() !== req.user.id) {
      console.log('Unauthorized delete attempt for workout:', req.params.id);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this workout'
      });
    }

    // Use deleteOne() instead of the deprecated remove() method
    // This is the preferred way in newer Mongoose versions
    await workout.deleteOne();
    
    // Alternative: You can also use Workout.findByIdAndDelete(req.params.id)
    // Both approaches work, but deleteOne() on the document instance is more explicit

    console.log('Workout deleted successfully');
    res.status(200).json({ 
      success: true, 
      data: {}, 
      message: 'Workout deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting workout:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete workout',
      error: error.message 
    });
  }
});