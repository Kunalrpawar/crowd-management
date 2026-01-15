const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/crowd', require('./routes/crowd'));
app.use('/api/routes', require('./routes/routes'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/predictions', require('./routes/predictions'));
app.use('/api/ml', require('./routes/ml'));
app.use('/api/lostfound', require('./routes/lostfound'));
app.use('/api/medical', require('./routes/medical'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/track-nashik', require('./routes/track-nashik'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Listen for client requests
  socket.on('requestCrowdUpdate', () => {
    const crowdData = generateCrowdData();
    socket.emit('crowdUpdate', crowdData);
  });
});

// Simulate real-time crowd updates
setInterval(() => {
  // Generate updates for all four locations
  const locations = ['prayagraj', 'haridwar', 'nashik', 'ujjain'];
  locations.forEach(location => {
    const crowdData = generateCrowdData(location);
    io.emit('crowdUpdate', crowdData);
  });
}, 5000);

// Simulate emergency alerts
setInterval(() => {
  if (Math.random() > 0.9) { // 10% chance of alert
    const alert = generateEmergencyAlert();
    io.emit('emergencyAlert', alert);
  }
}, 30000);

// Helper functions
function generateCrowdData(location = 'prayagraj') {
  const kumbhZones = {
    prayagraj: [
      { id: 1, name: 'Sangam Nose (Triveni Sangam)', lat: 25.4358, lng: 81.8463 },
      { id: 2, name: 'Triveni Ghat', lat: 25.4288, lng: 81.8403 },
      { id: 3, name: 'Saraswati Ghat', lat: 25.4338, lng: 81.8403 },
      { id: 4, name: 'Akshayavat', lat: 25.4398, lng: 81.8343 },
      { id: 5, name: 'Parade Ground', lat: 25.4428, lng: 81.8523 },
      { id: 6, name: 'Sector 1', lat: 25.4198, lng: 81.8343 },
      { id: 7, name: 'Sector 2', lat: 25.4518, lng: 81.8583 },
    ],
    haridwar: [
      { id: 11, name: 'Har Ki Pauri', lat: 29.9457, lng: 78.1642 },
      { id: 12, name: 'Brahma Kund', lat: 29.9467, lng: 78.1652 },
      { id: 13, name: 'Gau Ghat', lat: 29.9437, lng: 78.1632 },
      { id: 14, name: 'Vishnu Ghat', lat: 29.9477, lng: 78.1662 },
      { id: 15, name: 'Mansa Devi Temple Area', lat: 29.9827, lng: 78.1712 },
    ],
    nashik: [
      { id: 21, name: 'Ramkund', lat: 19.9975, lng: 73.7898 },
      { id: 22, name: 'Kushavarta Kund', lat: 19.9985, lng: 73.7908 },
      { id: 23, name: 'Naroshankar Temple', lat: 19.9965, lng: 73.7888 },
      { id: 24, name: 'Sita Gufa', lat: 19.9955, lng: 73.7878 },
      { id: 25, name: 'Kalaram Temple', lat: 19.9995, lng: 73.7918 },
    ],
    ujjain: [
      { id: 31, name: 'Ram Ghat', lat: 23.1765, lng: 75.7885 },
      { id: 32, name: 'Mahakaleshwar Temple', lat: 23.1825, lng: 75.7685 },
      { id: 33, name: 'Kshipra River Bank', lat: 23.1745, lng: 75.7865 },
      { id: 34, name: 'Harsiddhi Temple', lat: 23.1785, lng: 75.7905 },
      { id: 35, name: 'Kal Bhairav Temple', lat: 23.1805, lng: 75.7925 },
    ]
  };

  const zones = kumbhZones[location] || kumbhZones.prayagraj;
  const zonesWithData = zones.map(zone => ({
    ...zone,
    density: Math.random(),
    people: Math.floor(Math.random() * 50000) + 10000,
    location: location
  }));

  return {
    location: location,
    zones: zonesWithData,
    totalPeople: Math.floor(Math.random() * 50000) + 100000,
    dangerZones: Math.floor(Math.random() * 5) + 1,
    safeZones: Math.floor(Math.random() * 15) + 10,
    averageWaitTime: Math.floor(Math.random() * 20) + 5,
    timestamp: new Date().toISOString()
  };
}

function generateEmergencyAlert() {
  const types = ['warning', 'critical', 'info'];
  const locations = ['Sangam Nose', 'Triveni Ghat', 'Parade Ground', 'Sector 1', 'Sector 2'];
  const messages = [
    'High crowd density detected',
    'Emergency services dispatched',
    'Route temporarily closed for safety',
    'Medical assistance required',
    'Traffic congestion ahead'
  ];

  return {
    id: Date.now(),
    type: types[Math.floor(Math.random() * types.length)],
    title: 'Emergency Alert',
    message: messages[Math.floor(Math.random() * messages.length)],
    location: locations[Math.floor(Math.random() * locations.length)],
    timestamp: new Date().toISOString()
  };
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready for connections`);
});

module.exports = { app, io };
