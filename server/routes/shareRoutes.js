const express = require('express');
const shareController = require('../controllers/shareController');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/workouts/:id', authController.protect, shareController.shareWorkout);
router.get('/workouts/:id', shareController.getSharedWorkout);

module.exports = router;
