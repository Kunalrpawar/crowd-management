const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// Get user by email
router.get('/email/:email', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// Create new user/Register
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      address,
      language,
      emergencyContact
    } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate unique pilgrim ID
    const pilgrimId = 'KM2026-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    // Create user
    const user = new User({
      name,
      email,
      password, // In production, hash this password using bcrypt
      phone,
      address,
      language: language || 'English',
      pilgrimId,
      emergencyContact
    });

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userResponse
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// Update user profile
router.put('/:id', async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      language,
      emergencyContact,
      profileImage
    } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (language) updateData.language = language;
    if (emergencyContact) updateData.emergencyContact = emergencyContact;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// Update last login
router.patch('/:id/login', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { lastLogin: new Date() },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error updating last login:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating last login',
      error: error.message
    });
  }
});

// Add visited location
router.post('/:id/location', async (req, res) => {
  try {
    const { location } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          visitedLocations: {
            location,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Location added successfully',
      data: user
    });
  } catch (error) {
    console.error('Error adding location:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding location',
      error: error.message
    });
  }
});

// Add attended event
router.post('/:id/event', async (req, res) => {
  try {
    const { event } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          eventsAttended: {
            event,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Event added successfully',
      data: user
    });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding event',
      error: error.message
    });
  }
});

// Get user statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const stats = {
      locationsVisited: user.visitedLocations?.length || 0,
      eventsAttended: user.eventsAttended?.length || 0,
      daysSinceRegistration: Math.floor(
        (new Date() - user.registrationDate) / (1000 * 60 * 60 * 24)
      ),
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user statistics',
      error: error.message
    });
  }
});

// Delete user (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error deactivating user',
      error: error.message
    });
  }
});

module.exports = router;
