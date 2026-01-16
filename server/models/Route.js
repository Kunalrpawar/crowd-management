const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    enum: ['prayagraj', 'haridwar', 'nashik', 'ujjain'],
    required: true
  },
  startLocation: {
    name: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  endLocation: {
    name: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  waypoints: [{
    name: String,
    coordinates: [Number],
    order: Number
  }],
  path: {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString'
    },
    coordinates: [[Number]] // Array of [longitude, latitude] pairs
  },
  distance: {
    type: Number, // in meters
    required: true
  },
  estimatedTime: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'moderate', 'difficult'],
    default: 'easy'
  },
  crowdLevel: {
    type: String,
    enum: ['low', 'moderate', 'high', 'critical'],
    default: 'moderate'
  },
  accessibility: {
    wheelchair: Boolean,
    elderly: Boolean,
    children: Boolean
  },
  amenities: [{
    type: {
      type: String,
      enum: ['water', 'restroom', 'medical', 'food', 'rest-area', 'parking']
    },
    name: String,
    coordinates: [Number]
  }],
  conditions: {
    isSafe: {
      type: Boolean,
      default: true
    },
    isOpen: {
      type: Boolean,
      default: true
    },
    trafficStatus: {
      type: String,
      enum: ['free', 'moderate', 'heavy', 'blocked'],
      default: 'free'
    }
  },
  warnings: [String],
  recommendations: [String],
  popularity: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 3
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
routeSchema.index({ city: 1 });
routeSchema.index({ 'conditions.isSafe': 1, 'conditions.isOpen': 1 });
routeSchema.index({ crowdLevel: 1 });

module.exports = mongoose.model('Route', routeSchema);
