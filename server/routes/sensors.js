
const express = require('express');
const router = express.Router();
const { getSensorData, getRecentActivity, updateSensorStatus } = require('../controllers/sensorController');

// Get all sensor data
router.get('/', getSensorData);

// Get recent activity from sensors
router.get('/recent-activity', getRecentActivity);

// Update sensor status (for IoT devices to push data)
router.post('/update', updateSensorStatus);

module.exports = router;
