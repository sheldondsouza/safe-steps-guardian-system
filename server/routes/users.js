
const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile } = require('../controllers/userController');

// Get user profile
router.get('/profile/:id', getUserProfile);

// Update user profile
router.put('/profile/:id', updateUserProfile);

module.exports = router;
