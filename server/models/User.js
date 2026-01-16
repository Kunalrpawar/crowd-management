const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    default: 'English',
    enum: ['English', 'Hindi', 'Marathi', 'Bengali', 'Tamil', 'Telugu']
  },
  pilgrimId: {
    type: String,
    unique: true,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'medical', 'security'],
    default: 'user'
  },
  profileImage: {
    type: String
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  visitedLocations: [{
    location: String,
    timestamp: Date
  }],
  eventsAttended: [{
    event: String,
    timestamp: Date
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
