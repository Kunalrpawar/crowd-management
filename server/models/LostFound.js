const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['missing', 'found'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'investigating'],
    default: 'active'
  },
  name: {
    type: String,
    required: function() { return this.type === 'missing'; },
    trim: true
  },
  age: {
    type: Number,
    min: 0
  },
  approximateAge: {
    type: String
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lastSeenLocation: {
    type: String
  },
  currentLocation: {
    type: String
  },
  contactNumber: {
    type: String,
    required: true
  },
  alternateContact: {
    type: String
  },
  clothingDescription: {
    type: String
  },
  identificationMarks: {
    type: String
  },
  photo: {
    type: String
  },
  additionalInfo: {
    type: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      index: '2dsphere'
    }
  },
  reportedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  },
  notes: [{
    text: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  matchedWith: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LostFound'
  }
}, {
  timestamps: true
});

// Indexes for faster searches
lostFoundSchema.index({ type: 1, status: 1 });
lostFoundSchema.index({ reportedAt: -1 });
lostFoundSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('LostFound', lostFoundSchema);
