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
  const crowdData = generateCrowdData();
  io.emit('crowdUpdate', crowdData);
}, 5000);

// Simulate emergency alerts
setInterval(() => {
  if (Math.random() > 0.9) { // 10% chance of alert
    const alert = generateEmergencyAlert();
    io.emit('emergencyAlert', alert);
  }
}, 30000);

// Helper functions
function generateCrowdData() {
  return {
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
