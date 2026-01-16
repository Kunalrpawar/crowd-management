const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  location: {
    name: String,
    city: {
      type: String,
      enum: ['prayagraj', 'haridwar', 'nashik', 'ujjain']
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: '2dsphere'
      }
    }
  },
  predictionType: {
    type: String,
    enum: ['crowd', 'weather', 'traffic', 'event'],
    required: true
  },
  timeRange: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  predictions: [{
    timestamp: Date,
    value: Number,
    confidence: Number,
    category: String,
    details: mongoose.Schema.Types.Mixed
  }],
  crowdPrediction: {
    expectedCount: Number,
    crowdLevel: {
      type: String,
      enum: ['low', 'moderate', 'high', 'critical']
    },
    peakTime: Date,
    factors: [String]
  },
  weatherPrediction: {
    temperature: Number,
    humidity: Number,
    rainfall: Number,
    condition: String,
    windSpeed: Number
  },
  trafficPrediction: {
    congestionLevel: {
      type: String,
      enum: ['free', 'moderate', 'heavy', 'blocked']
    },
    estimatedDelay: Number
  },
  model: {
    name: String,
    version: String,
    accuracy: Number,
    lastTrained: Date
  },
  dataSource: {
    historical: Boolean,
    realtime: Boolean,
    external: [String]
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1
  },
  factors: [{
    name: String,
    impact: Number,
    description: String
  }],
  recommendations: [String],
  alerts: [{
    level: String,
    message: String,
    time: Date
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
predictionSchema.index({ 'location.city': 1, 'timeRange.start': 1 });
predictionSchema.index({ predictionType: 1 });
predictionSchema.index({ generatedAt: -1 });

module.exports = mongoose.model('Prediction', predictionSchema);
