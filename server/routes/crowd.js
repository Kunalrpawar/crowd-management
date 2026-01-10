const express = require('express');
const router = express.Router();

// Get current crowd data for all zones
router.get('/zones', (req, res) => {
  const zones = [
    { id: 1, name: 'Sangam Nose', lat: 25.4358, lng: 81.8463, density: Math.random(), people: Math.floor(Math.random() * 50000) + 10000 },
    { id: 2, name: 'Triveni Ghat', lat: 25.4288, lng: 81.8403, density: Math.random(), people: Math.floor(Math.random() * 40000) + 8000 },
    { id: 3, name: 'Parade Ground', lat: 25.4428, lng: 81.8523, density: Math.random(), people: Math.floor(Math.random() * 35000) + 7000 },
    { id: 4, name: 'Sector 1', lat: 25.4198, lng: 81.8343, density: Math.random(), people: Math.floor(Math.random() * 30000) + 6000 },
    { id: 5, name: 'Sector 2', lat: 25.4518, lng: 81.8583, density: Math.random(), people: Math.floor(Math.random() * 28000) + 5500 },
    { id: 6, name: 'Sector 3', lat: 25.4258, lng: 81.8583, density: Math.random(), people: Math.floor(Math.random() * 25000) + 5000 },
    { id: 7, name: 'Akshayavat', lat: 25.4398, lng: 81.8343, density: Math.random(), people: Math.floor(Math.random() * 22000) + 4500 },
    { id: 8, name: 'Saraswati Ghat', lat: 25.4338, lng: 81.8403, density: Math.random(), people: Math.floor(Math.random() * 20000) + 4000 }
  ];

  res.json({
    success: true,
    data: zones,
    timestamp: new Date().toISOString()
  });
});

// Get crowd data for specific zone
router.get('/zones/:id', (req, res) => {
  const { id } = req.params;
  
  const zone = {
    id: parseInt(id),
    name: 'Sangam Nose',
    lat: 25.4358,
    lng: 81.8463,
    density: Math.random(),
    people: Math.floor(Math.random() * 50000) + 10000,
    history: generateHistoricalData(24)
  };

  res.json({
    success: true,
    data: zone,
    timestamp: new Date().toISOString()
  });
});

// Get overall statistics
router.get('/stats', (req, res) => {
  const stats = {
    totalPeople: Math.floor(Math.random() * 50000) + 100000,
    dangerZones: Math.floor(Math.random() * 5) + 1,
    safeZones: Math.floor(Math.random() * 15) + 10,
    averageWaitTime: Math.floor(Math.random() * 20) + 5,
    peakHours: ['12:00 PM - 2:00 PM', '4:00 PM - 6:00 PM'],
    timestamp: new Date().toISOString()
  };

  res.json({
    success: true,
    data: stats
  });
});

function generateHistoricalData(hours) {
  const data = [];
  for (let i = 0; i < hours; i++) {
    data.push({
      hour: i,
      people: Math.floor(Math.random() * 40000) + 20000,
      density: Math.random()
    });
  }
  return data;
}

module.exports = router;
