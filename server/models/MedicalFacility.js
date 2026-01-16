const mongoose = require('mongoose');

const medicalFacilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['hospital', 'emergency', 'first-aid', 'pharmacy', 'trauma', 'mobile', 'clinic'],
    required: true
  },
  location: {
    address: String,
    city: String,
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
  contact: {
    phone: String,
    emergency: String,
    email: String
  },
  capacity: {
    total: Number,
    available: Number,
    icu: Number,
    general: Number
  },
  facilities: [String],
  specialists: [String],
  availability: {
    type: String,
    enum: ['24x7', 'daytime', 'limited'],
    default: '24x7'
  },
  status: {
    type: String,
    enum: ['operational', 'busy', 'full', 'emergency-only', 'closed'],
    default: 'operational'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4
  },
  ambulances: {
    total: Number,
    available: Number
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

medicalFacilitySchema.index({ 'location.coordinates': '2dsphere' });
medicalFacilitySchema.index({ type: 1, status: 1 });

module.exports = mongoose.model('MedicalFacility', medicalFacilitySchema);
