const express = require('express');
const router = express.Router();

// Zone data for all four sacred Kumbh Mela locations
const kumbhZones = {
  prayagraj: [
    { id: 1, name: 'Sangam Nose (Triveni Sangam)', lat: 25.4358, lng: 81.8463, location: 'prayagraj' },
    { id: 2, name: 'Triveni Ghat', lat: 25.4288, lng: 81.8403, location: 'prayagraj' },
    { id: 3, name: 'Saraswati Ghat', lat: 25.4338, lng: 81.8403, location: 'prayagraj' },
    { id: 4, name: 'Akshayavat', lat: 25.4398, lng: 81.8343, location: 'prayagraj' },
    { id: 5, name: 'Parade Ground', lat: 25.4428, lng: 81.8523, location: 'prayagraj' },
    { id: 6, name: 'Sector 1', lat: 25.4198, lng: 81.8343, location: 'prayagraj' },
    { id: 7, name: 'Sector 2', lat: 25.4518, lng: 81.8583, location: 'prayagraj' },
  ],
  haridwar: [
    { id: 11, name: 'Har Ki Pauri', lat: 29.9457, lng: 78.1642, location: 'haridwar' },
    { id: 12, name: 'Brahma Kund', lat: 29.9467, lng: 78.1652, location: 'haridwar' },
    { id: 13, name: 'Gau Ghat', lat: 29.9437, lng: 78.1632, location: 'haridwar' },
    { id: 14, name: 'Vishnu Ghat', lat: 29.9477, lng: 78.1662, location: 'haridwar' },
    { id: 15, name: 'Mansa Devi Temple Area', lat: 29.9827, lng: 78.1712, location: 'haridwar' },
  ],
  nashik: [
    { id: 21, name: 'Ramkund', lat: 19.9975, lng: 73.7898, location: 'nashik' },
    { id: 22, name: 'Kushavarta Kund', lat: 19.9985, lng: 73.7908, location: 'nashik' },
    { id: 23, name: 'Naroshankar Temple', lat: 19.9965, lng: 73.7888, location: 'nashik' },
    { id: 24, name: 'Sita Gufa', lat: 19.9955, lng: 73.7878, location: 'nashik' },
    { id: 25, name: 'Kalaram Temple', lat: 19.9995, lng: 73.7918, location: 'nashik' },
  ],
  ujjain: [
    { id: 31, name: 'Ram Ghat', lat: 23.1765, lng: 75.7885, location: 'ujjain' },
    { id: 32, name: 'Mahakaleshwar Temple', lat: 23.1825, lng: 75.7685, location: 'ujjain' },
    { id: 33, name: 'Kshipra River Bank', lat: 23.1745, lng: 75.7865, location: 'ujjain' },
    { id: 34, name: 'Harsiddhi Temple', lat: 23.1785, lng: 75.7905, location: 'ujjain' },
    { id: 35, name: 'Kal Bhairav Temple', lat: 23.1805, lng: 75.7925, location: 'ujjain' },
  ]
};

// Get current crowd data for all zones
router.get('/zones', (req, res) => {
  const location = req.query.location || 'prayagraj';
  const zones = kumbhZones[location] || kumbhZones.prayagraj;
  
  // Add dynamic crowd data
  const zonesWithData = zones.map(zone => ({
    ...zone,
    density: Math.random(),
    people: Math.floor(Math.random() * 50000) + 10000
  }));

  res.json({
    success: true,
    data: zonesWithData,
    location: location,
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
