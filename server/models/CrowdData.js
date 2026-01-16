const mongoose = require('mongoose');

const crowdDataSchema = new mongoose.Schema({
  location: {
    name: {
      type: String,
      required: true
    },
    city: {
      type: String,
      enum: ['prayagraj', 'haridwar', 'nashik', 'ujjain'],
      required: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: '2dsphere'
      }
    }
  },
  crowdLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    required: true
  },
  density: {
    type: Number, // people per square meter
    required: true,
    min: 0
  },
  count: {
    type: Number,
    required: true,
    min: 0
  },
  trend: {
    type: String,
    enum: ['increasing', 'stable', 'decreasing'],
    default: 'stable'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  source: {
    type: String,
    enum: ['ai-camera', 'manual', 'sensor', 'estimated'],
    default: 'ai-camera'
  },
  alerts: [{
    type: {
      type: String,
      enum: ['overcrowding', 'stampede-risk', 'emergency', 'warning']
    },
    message: String,
    timestamp: Date
  }],
  weather: {
    temperature: Number,
    humidity: Number,
    condition: String
  },
  metadata: {
    cameraId: String,
    accuracy: Number,
    processingTime: Number
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
crowdDataSchema.index({ timestamp: -1 });
crowdDataSchema.index({ 'location.city': 1, timestamp: -1 });
crowdDataSchema.index({ 'location.coordinates': '2dsphere' });
crowdDataSchema.index({ crowdLevel: 1 });

module.exports = mongoose.model('CrowdData', crowdDataSchema);
