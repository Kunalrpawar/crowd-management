const express = require('express');
const router = express.Router();

// Get crowd predictions
router.get('/', (req, res) => {
  const hours = parseInt(req.query.hours) || 24;
  const predictions = generatePredictions(hours);

  res.json({
    success: true,
    data: predictions,
    timestamp: new Date().toISOString()
  });
});

// Get zone-specific predictions
router.get('/zones/:id', (req, res) => {
  const { id } = req.params;
  const hours = parseInt(req.query.hours) || 24;

  const prediction = {
    zoneId: parseInt(id),
    zoneName: 'Sangam Nose',
    predictions: generatePredictions(hours),
    peakTimes: ['12:00 PM', '4:00 PM'],
    recommendedVisitTime: '6:00 AM - 9:00 AM',
    confidence: (Math.random() * 10 + 90).toFixed(1)
  };

  res.json({
    success: true,
    data: prediction,
    timestamp: new Date().toISOString()
  });
});

// Get peak hours prediction
router.get('/peak-hours', (req, res) => {
  const peakHours = [
    {
      time: '12:00 PM - 2:00 PM',
      expectedCrowd: 125000,
      riskLevel: 'High'
    },
    {
      time: '4:00 PM - 6:00 PM',
      expectedCrowd: 115000,
      riskLevel: 'High'
    },
    {
      time: '6:00 AM - 9:00 AM',
      expectedCrowd: 65000,
      riskLevel: 'Low'
    }
  ];

  res.json({
    success: true,
    data: peakHours,
    timestamp: new Date().toISOString()
  });
});

// Get risk assessment
router.get('/risk-assessment', (req, res) => {
  const assessment = {
    overall: 'Medium',
    zones: [
      { id: 1, name: 'Sangam Nose', risk: 'High', probability: 0.85 },
      { id: 2, name: 'Triveni Ghat', risk: 'Medium', probability: 0.65 },
      { id: 3, name: 'Parade Ground', risk: 'Low', probability: 0.35 }
    ],
    factors: [
      'Historical crowd patterns',
      'Current weather conditions',
      'Special events scheduled',
      'Transportation availability'
    ],
    recommendations: [
      'Visit early morning hours',
      'Use designated safe routes',
      'Follow crowd control instructions'
    ]
  };

  res.json({
    success: true,
    data: assessment,
    timestamp: new Date().toISOString()
  });
});

function generatePredictions(hours) {
  const predictions = [];
  const now = new Date();

  for (let i = 0; i < hours; i++) {
    const time = new Date(now.getTime() + i * 60 * 60 * 1000);
    const hour = time.getHours();
    
    // Simulate crowd patterns (higher during day)
    const baseCrowd = hour >= 6 && hour <= 18 ? 
      Math.random() * 30000 + 70000 : 
      Math.random() * 20000 + 30000;

    predictions.push({
      time: time.toISOString(),
      predictedCrowd: Math.floor(baseCrowd),
      confidence: (Math.random() * 15 + 85).toFixed(1),
      riskLevel: baseCrowd > 90000 ? 'High' : baseCrowd > 60000 ? 'Medium' : 'Low'
    });
  }

  return predictions;
}

module.exports = router;
