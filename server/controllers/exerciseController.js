const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// @desc Get all exercises for user
// @route GET /api/exercises
// @access Private
exports.getExercises = asyncHandler(async (req, res) => {
  console.log('Getting exercises for user:', req.user.id);
  
  try {
    const exercises = await Exercise.find({ user: req.user.id });
    console.log('Found exercises:', exercises.length);
    res.status(200).json({ success: true, count: exercises.length, data: exercises });
  } catch (error) {
    console.error('Error fetching exercises:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch exercises',
      error: error.message 
    });
  }
});

// @desc Get single exercise
// @route GET /api/exercises/:id
// @access Private
exports.getExercise = asyncHandler(async (req, res) => {
  console.log('Fetching exercise with ID:', req.params.id);
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid exercise ID format'
      });
    }

    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      console.log('Exercise not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    if (exercise.user.toString() !== req.user.id) {
      console.log('Unauthorized access attempt for exercise:', req.params.id);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this exercise'
      });
    }

    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    console.error('Error fetching exercise:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch exercise',
      error: error.message 
    });
  }
});

// @desc Create new exercise
// @route POST /api/exercises
// @access Private
exports.createExercise = asyncHandler(async (req, res) => {
  console.log('Creating exercise with data:', req.body);
  
  try {
    const { name, muscleGroup, equipment, instructions, caloriesPerRep } = req.body;

    // Validation
    if (!name || !muscleGroup || !equipment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, muscle group, and equipment'
      });
    }

    const exercise = await Exercise.create({
      user: req.user.id,
      name,
      muscleGroup,
      equipment,
      instructions: instructions || '',
      caloriesPerRep: caloriesPerRep || 0
    });

    console.log('Exercise created:', exercise);
    res.status(201).json({ success: true, data: exercise });
  } catch (error) {
    console.error('Error creating exercise:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Exercise with this name already exists'
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create exercise',
      error: error.message 
    });
  }
});

// @desc Update exercise
// @route PUT /api/exercises/:id
// @access Private
exports.updateExercise = asyncHandler(async (req, res) => {
  console.log('Updating exercise:', req.params.id, req.body);
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid exercise ID format'
      });
    }

    let exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      console.log('Exercise not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    if (exercise.user.toString() !== req.user.id) {
      console.log('Unauthorized update attempt for exercise:', req.params.id);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this exercise'
      });
    }

    // Remove undefined fields from req.body
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        updateData[key] = req.body[key];
      }
    });

    exercise = await Exercise.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      {
        new: true,
        runValidators: true
      }
    );

    console.log('Exercise updated:', exercise);
    res.status(200).json({ success: true, data: exercise });
  } catch (error) {
    console.error('Error updating exercise:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Exercise with this name already exists'
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
      message: 'Failed to update exercise',
      error: error.message 
    });
  }
});

// @desc Delete exercise
// @route DELETE /api/exercises/:id
// @access Private
exports.deleteExercise = asyncHandler(async (req, res) => {
  console.log('Deleting exercise:', req.params.id);
  
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log('Invalid ObjectId format:', req.params.id);
      return res.status(400).json({
        success: false,
        message: 'Invalid exercise ID format'
      });
    }

    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      console.log('Exercise not found for ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Exercise not found'
      });
    }

    if (exercise.user.toString() !== req.user.id) {
      console.log('Unauthorized delete attempt for exercise:', req.params.id);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this exercise'
      });
    }

    // Check if exercise is being used in any workouts
    console.log('Checking if exercise is used in workouts...');
    const workoutsUsingExercise = await Workout.find({
      user: req.user.id,
      'exercises.exercise': req.params.id
    });

    if (workoutsUsingExercise.length > 0) {
      console.log(`Exercise is used in ${workoutsUsingExercise.length} workout(s)`);
      const workoutNames = workoutsUsingExercise.map(w => w.name).join(', ');
      return res.status(400).json({
        success: false,
        message: `Cannot delete exercise. It is currently used in the following workout(s): ${workoutNames}. Please remove it from these workouts first.`
      });
    }

    // Use deleteOne() instead of remove()
    await exercise.deleteOne();
    
    console.log('Exercise deleted successfully');
    res.status(200).json({ 
      success: true, 
      data: {}, 
      message: 'Exercise deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting exercise:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete exercise',
      error: error.message 
    });
  }
});