const mongoose = require('mongoose');

const ParkingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    enum: ['prayagraj', 'haridwar', 'nashik', 'ujjain']
  },
  coordinates: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  type: {
    type: String,
    required: true,
    enum: ['car', 'bus', 'bike', 'multi']
  },
  capacity: {
    type: Number,
    required: true
  },
  occupied: {
    type: Number,
    default: 0
  },
  available: {
    type: Number
  },
  status: {
    type: String,
    enum: ['available', 'filling', 'full'],
    default: 'available'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Calculate available spaces before saving
ParkingSchema.pre('save', function(next) {
  this.available = this.capacity - this.occupied;
  const occupancyRate = (this.occupied / this.capacity) * 100;
  
  if (occupancyRate > 90) {
    this.status = 'full';
  } else if (occupancyRate > 70) {
    this.status = 'filling';
  } else {
    this.status = 'available';
  }
  
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model('Parking', ParkingSchema);
