const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = {
  // User Registration Validation
  validateRegisterInput(data) {
    const errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.confirmPassword = !isEmpty(data.confirmPassword) ? data.confirmPassword : '';
    data.fitnessGoal = !isEmpty(data.fitnessGoal) ? data.fitnessGoal : '';

    // Name validation
    if (validator.isEmpty(data.name)) {
      errors.name = 'Name field is required';
    } else if (!validator.isLength(data.name, { min: 2, max: 30 })) {
      errors.name = 'Name must be between 2 and 30 characters';
    }

    // Email validation
    if (validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    } else if (!validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }

    // Password validation
    if (validator.isEmpty(data.password)) {
      errors.password = 'Password field is required';
    } else if (!validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = 'Password must be between 6 and 30 characters';
    }

    // Confirm Password validation
    if (validator.isEmpty(data.confirmPassword)) {
      errors.confirmPassword = 'Confirm password field is required';
    } else if (!validator.equals(data.password, data.confirmPassword)) {
      errors.confirmPassword = 'Passwords must match';
    }

    // Fitness Goal validation - FIXED TO MATCH FRONTEND VALUES
    const validGoals = ['weight_loss', 'muscle_gain', 'endurance', 'strength', 'general_fitness'];
    if (!validGoals.includes(data.fitnessGoal)) {
      errors.fitnessGoal = 'Invalid fitness goal selected';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };
  },

  // User Login Validation
  validateLoginInput(data) {
    const errors = {};
    
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (validator.isEmpty(data.email)) {
      errors.email = 'Email field is required';
    } else if (!validator.isEmail(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (validator.isEmpty(data.password)) {
      errors.password = 'Password field is required';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };
  },

  // Workout Validation
  validateWorkoutInput(data) {
    const errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : '';
    data.exercises = !isEmpty(data.exercises) ? data.exercises : [];

    if (validator.isEmpty(data.name)) {
      errors.name = 'Workout name is required';
    } else if (!validator.isLength(data.name, { min: 3, max: 50 })) {
      errors.name = 'Workout name must be between 3 and 50 characters';
    }

    if (!Array.isArray(data.exercises)) {
      errors.exercises = 'Exercises must be an array';
    } else if (data.exercises.length === 0) {
      errors.exercises = 'At least one exercise is required';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };
  },

  // Exercise Validation
  validateExerciseInput(data) {
    const errors = {};
    
    data.name = !isEmpty(data.name) ? data.name : '';
    data.muscleGroup = !isEmpty(data.muscleGroup) ? data.muscleGroup : '';
    data.equipment = !isEmpty(data.equipment) ? data.equipment : '';

    const validMuscleGroups = ['chest', 'back', 'arms', 'shoulders', 'legs', 'core', 'full-body'];
    const validEquipment = ['barbell', 'dumbbell', 'machine', 'bodyweight', 'kettlebell', 'cable', 'bands', 'other'];

    if (validator.isEmpty(data.name)) {
      errors.name = 'Exercise name is required';
    } else if (!validator.isLength(data.name, { min: 3, max: 50 })) {
      errors.name = 'Exercise name must be between 3 and 50 characters';
    }

    if (validator.isEmpty(data.muscleGroup)) {
      errors.muscleGroup = 'Muscle group is required';
    } else if (!validMuscleGroups.includes(data.muscleGroup)) {
      errors.muscleGroup = 'Invalid muscle group selected';
    }

    if (validator.isEmpty(data.equipment)) {
      errors.equipment = 'Equipment type is required';
    } else if (!validEquipment.includes(data.equipment)) {
      errors.equipment = 'Invalid equipment type selected';
    }

    return {
      errors,
      isValid: isEmpty(errors),
    };
  },

  // Nutrition Log Validation
  validateNutritionInput(data) {
    const errors = {};
    
    data.food = !isEmpty(data.food) ? data.food : '';
    data.calories = !isEmpty(data.calories) ? data.calories : '';
    data.protein = !isEmpty(data.protein) ? data.protein : '';
    data.carbs = !isEmpty(data.carbs) ? data.carbs : '';
    data.fats = !isEmpty(data.fats) ? data.fats : '';

    if (validator.isEmpty(data.food)) {
      errors.food = 'Food name is required';
    } else if (!validator.isLength(data.food, { min: 2, max: 50 })) {
      errors.food = 'Food name must be between 2 and 50 characters';
    }

    if (validator.isEmpty(data.calories)) {
      errors.calories = 'Calories are required';
    } else if (!validator.isNumeric(data.calories)) {
      errors.calories = 'Calories must be a number';
    } else if (data.calories < 0) {
      errors.calories = 'Calories cannot be negative';
    }

    // Similar validation for protein, carbs, fats
    ['protein', 'carbs', 'fats'].forEach(nutrient => {
      if (validator.isEmpty(data[nutrient])) {
        errors[nutrient] = `${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} is required`;
      } else if (!validator.isNumeric(data[nutrient])) {
        errors[nutrient] = `${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} must be a number`;
      } else if (data[nutrient] < 0) {
        errors[nutrient] = `${nutrient.charAt(0).toUpperCase() + nutrient.slice(1)} cannot be negative`;
      }
    });

    return {
      errors,
      isValid: isEmpty(errors),
    };
  }
};