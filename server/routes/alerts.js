
const express = require('express');
const router = express.Router();
const { getAlerts, createAlert, updateAlert, deleteAlert } = require('../controllers/alertController');

// Get all alerts
router.get('/', getAlerts);

// Create new alert
router.post('/', createAlert);

// Update an alert
router.put('/:id', updateAlert);

// Delete an alert
router.delete('/:id', deleteAlert);

module.exports = router;
