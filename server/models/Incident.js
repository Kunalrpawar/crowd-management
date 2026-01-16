const mongoose = require('mongoose');

const IncidentSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['medical', 'crowd_surge', 'infrastructure', 'security', 'water_sanitation', 'fire', 'other']
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'critical']
  },
  location: {
    name: String,
    city: {
      type: String,
      enum: ['prayagraj', 'haridwar', 'nashik', 'ujjain']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  description: {
    type: String,
    required: true
  },
  reportedBy: {
    name: String,
    phone: String,
    role: String
  },
  status: {
    type: String,
    enum: ['reported', 'acknowledged', 'in_progress', 'resolved', 'closed'],
    default: 'reported'
  },
  assignedTeam: {
    teamId: String,
    teamName: String,
    contactNumber: String
  },
  responseTime: Number, // in minutes
  resolvedAt: Date,
  images: [String],
  affectedPeople: Number,
  notes: [
    {
      note: String,
      addedBy: String,
      timestamp: {
        type: Date,
        default: Date.now
      }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('Incident', IncidentSchema);
