const mongoose = require('mongoose');

const medicalEmergencySchema = new mongoose.Schema({
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  symptoms: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true,
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'dispatched', 'treating', 'resolved', 'cancelled'],
    default: 'pending'
  },
  location: {
    address: {
      type: String,
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
        index: '2dsphere'
      }
    }
  },
  contactNumber: {
    type: String,
    required: true
  },
  alternateContact: {
    type: String
  },
  assignedTo: {
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalFacility'
    },
    ambulance: String,
    medicalStaff: String
  },
  vitals: {
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    oxygenLevel: Number
  },
  medicalHistory: {
    allergies: [String],
    medications: [String],
    conditions: [String]
  },
  responseTime: {
    reported: {
      type: Date,
      default: Date.now
    },
    dispatched: Date,
    arrived: Date,
    resolved: Date
  },
  notes: [{
    text: String,
    addedBy: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  priority: {
    type: Number,
    default: 5,
    min: 1,
    max: 10
  }
}, {
  timestamps: true
});

// Indexes
medicalEmergencySchema.index({ status: 1, severity: 1 });
medicalEmergencySchema.index({ 'location.coordinates': '2dsphere' });
medicalEmergencySchema.index({ 'responseTime.reported': -1 });

module.exports = mongoose.model('MedicalEmergency', medicalEmergencySchema);
