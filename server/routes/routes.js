const express = require('express');
const router = express.Router();

// Calculate safe route between two points
router.post('/calculate', (req, res) => {
  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({
      success: false,
      message: 'Start and end points are required'
    });
  }

  // Simulate route calculation
  const route = {
    path: [start, end],
    distance: (Math.random() * 3 + 1).toFixed(1),
    estimatedTime: Math.floor(Math.random() * 20 + 10),
    crowdLevel: Math.random() < 0.5 ? 'Low' : 'Medium',
    safetyScore: (Math.random() * 30 + 70).toFixed(1),
    waypoints: generateWaypoints(start, end),
    alternatives: generateAlternativeRoutes()
  };

  res.json({
    success: true,
    data: route,
    timestamp: new Date().toISOString()
  });
});

// Get alternative routes
router.get('/alternatives', (req, res) => {
  const alternatives = generateAlternativeRoutes();

  res.json({
    success: true,
    data: alternatives,
    timestamp: new Date().toISOString()
  });
});

function generateWaypoints(start, end) {
  return [
    start,
    { lat: (start.lat + end.lat) / 2, lng: (start.lng + end.lng) / 2 },
    end
  ];
}

function generateAlternativeRoutes() {
  return [
    {
      id: 1,
      name: 'Route A - Main Path',
      distance: 2.5,
      time: 25,
      crowdLevel: 'Medium',
      safetyScore: 85
    },
    {
      id: 2,
      name: 'Route B - Bypass',
      distance: 3.2,
      time: 30,
      crowdLevel: 'Low',
      safetyScore: 92
    },
    {
      id: 3,
      name: 'Route C - Scenic',
      distance: 2.8,
      time: 28,
      crowdLevel: 'Low',
      safetyScore: 88
    }
  ];
}

module.exports = router;
