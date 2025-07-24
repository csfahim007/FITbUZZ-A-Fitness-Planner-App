const jwt = require('jsonwebtoken');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const { validateRegisterInput, validateLoginInput } = require('../utils/validate');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');

// Generate CSRF token
// const generateCSRFToken = () => {
//   return crypto.randomBytes(32).toString('hex');
// };

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  skipSuccessfulRequests: true
});

// @desc    Register user 
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res) => {
  // Validate input
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors 
    });
  }

  const { name, email, password, fitnessGoal } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({
      success: false,
      message: 'User already exists',
      errors: { email: 'User already exists with this email' }
    });
  }
  console.log('Registration attempt:', {
    body: req.body,
    headers: req.headers
  });

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    fitnessGoal
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user data'
    });
  }

  // Generate tokens
  const token = generateToken(user._id);
//   const csrfToken = generateCSRFToken();

  // Set secure cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    path: '/'
  });

//   res.cookie('csrfToken', csrfToken, {
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     path: '/'
//   });

  // Send response
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      fitnessGoal: user.fitnessGoal,
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res) => {
  // Validate input
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors 
    });
  }

  const { email, password } = req.body;

  // Find user and verify password
  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
      errors: { email: 'Invalid email or password' }
    });
  }

  // Generate tokens
  const token = generateToken(user._id);
//   const csrfToken = generateCSRFToken();

  // Set secure cookies
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/'
  });

//   res.cookie('csrfToken', csrfToken, {
//     secure: process.env.NODE_ENV === 'production',
//     sameSite: 'strict',
//     maxAge: 30 * 24 * 60 * 60 * 1000,
//     path: '/'
//   });

  // Send response
  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      fitnessGoal: user.fitnessGoal,
      token
    }
  });
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = asyncHandler(async (req, res) => {
  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('csrfToken');
  
  res.status(200).json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});

// @desc    Refresh token
// @route   POST /api/auth/refresh
// @access  Private
exports.refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authenticated' 
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    const newToken = generateToken(user._id);
    
    res.cookie('token', newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/'
    });

    res.json({ 
      success: true,
      token: newToken 
    });
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token' 
    });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select('-password -__v')
    .lean();

  if (!user) {
    return res.status(404).json({ 
      success: false,
      message: 'User not found' 
    });
  }

  res.status(200).json({ 
    success: true,
    data: user 
  });
});

// @desc    Auth middleware
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check cookies first
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Fallback to Authorization header
  else if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, no token provided' 
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get fresh user data
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // CSRF verification removed - no longer needed
    next();
  } catch (err) {
    return res.status(401).json({ 
      success: false,
      message: 'Not authorized, token failed' 
    });
  }
});

exports.updateMe = asyncHandler(async (req, res) => {
  const updates = {};

  if (req.body.name) updates.name = req.body.name;
  if (req.body.email) updates.email = req.body.email;
  if (req.body.fitnessGoal) updates.fitnessGoal = req.body.fitnessGoal;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password -__v');

  if (!updatedUser) {
    return res.status(404).json({ 
      success: false, 
      message: 'User not found' 
    });
  }

  res.status(200).json({
    success: true,
    data: updatedUser
  });
});
// @desc    Admin middleware
exports.admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied. Admins only.'
    });
  }
});

// Add these methods to your authController.js

// @desc    Change user password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters long'
    });
  }

  // Get user with password
  const user = await User.findById(req.user._id);

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Delete user account
// @route   DELETE /api/auth/delete-account
// @access  Private
exports.deleteAccount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Delete all user-related data
  // You might want to delete workouts, nutrition entries, etc.
  // await Workout.deleteMany({ user: userId });
  // await NutritionEntry.deleteMany({ user: userId });
  
  // Delete the user
  await User.findByIdAndDelete(userId);

  // Clear cookies
  res.clearCookie('token');
  res.clearCookie('csrfToken');

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

// @desc    Upload user avatar
// @route   POST /api/auth/upload-avatar
// @access  Private
exports.uploadAvatar = asyncHandler(async (req, res) => {
  // This would require multer middleware for file upload
  // For now, just return a placeholder response
  res.status(200).json({
    success: true,
    message: 'Avatar upload functionality coming soon',
    data: {
      avatarUrl: '/default-avatar.png'
    }
  });
});

// @desc    Get user statistics
// @route   GET /api/auth/stats
// @access  Private
exports.getUserStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  
  // Calculate user statistics
  // This would involve aggregating data from workouts, nutrition, etc.
  const stats = {
    totalWorkouts: 0,
    daysActive: 0,
    caloriesBurned: 0,
    streakDays: 0,
    joinDate: req.user.createdAt,
    // Add more stats as needed
  };

  res.status(200).json({
    success: true,
    data: stats
  });
});
// Apply rate limiting to auth endpoints
exports.authLimiter = authLimiter;