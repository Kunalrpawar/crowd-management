const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['emergency', 'overcrowding', 'stampede', 'medical', 'lost-person', 'weather', 'security', 'traffic', 'announcement'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  location: {
    name: String,
    city: String,
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
  affectedArea: {
    radius: Number, // in meters
    zones: [String]
  },
  status: {
    type: String,
    enum: ['active', 'acknowledged', 'resolved', 'expired'],
    default: 'active'
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  issuedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  issuedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date
  },
  resolvedAt: {
    type: Date
  },
  notificationsSent: {
    sms: {
      sent: Number,
      failed: Number
    },
    push: {
      sent: Number,
      failed: Number
    },
    broadcast: Boolean
  },
  relatedIncidents: [{
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  }],
  relatedModel: {
    type: String,
    enum: ['MedicalEmergency', 'LostFound', 'CrowdData']
  },
  actions: [{
    action: String,
    takenBy: String,
    timestamp: Date
  }],
  tags: [String]
}, {
  timestamps: true
});

// Indexes
alertSchema.index({ status: 1, severity: 1 });
alertSchema.index({ issuedAt: -1 });
alertSchema.index({ 'location.coordinates': '2dsphere' });
alertSchema.index({ type: 1 });

module.exports = mongoose.model('Alert', alertSchema);
