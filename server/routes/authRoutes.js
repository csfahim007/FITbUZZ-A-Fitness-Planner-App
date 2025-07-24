const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Apply auth-specific rate limiting
router.use(authController.authLimiter);

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refreshToken);

// Protected routes (require authentication)
router.get('/me', authController.protect, authController.getMe);
router.put('/me', authController.protect, authController.updateMe);
router.put('/change-password', authController.protect, authController.changePassword);
router.delete('/delete-account', authController.protect, authController.deleteAccount);
router.post('/upload-avatar', authController.protect, authController.uploadAvatar);
router.get('/stats', authController.protect, authController.getUserStats);

// Admin route example
router.get('/admin', authController.protect, authController.admin, (req, res) => {
  res.json({ 
    success: true,
    message: 'Admin access granted',
    user: req.user
  });
});

module.exports = router;