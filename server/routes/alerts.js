const express = require('express');
const router = express.Router();

let alerts = [];

// Get all active alerts
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: alerts.filter(alert => alert.active),
    timestamp: new Date().toISOString()
  });
});

// Create new alert
router.post('/', (req, res) => {
  const { type, title, message, location } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: 'Alert message is required'
    });
  }

  const alert = {
    id: Date.now(),
    type: type || 'info',
    title: title || 'Alert',
    message,
    location,
    active: true,
    createdAt: new Date().toISOString()
  };

  alerts.push(alert);

  // Broadcast via Socket.IO (if io is available)
  if (req.app.locals.io) {
    req.app.locals.io.emit('emergencyAlert', alert);
  }

  res.json({
    success: true,
    data: alert
  });
});

// Dismiss an alert
router.patch('/:id/dismiss', (req, res) => {
  const { id } = req.params;
  const alert = alerts.find(a => a.id === parseInt(id));

  if (!alert) {
    return res.status(404).json({
      success: false,
      message: 'Alert not found'
    });
  }

  alert.active = false;

  res.json({
    success: true,
    data: alert
  });
});

// Get alert history
router.get('/history', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;

  res.json({
    success: true,
    data: alerts.slice(-limit),
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
