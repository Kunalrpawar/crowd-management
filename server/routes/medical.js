const express = require('express');
const router = express.Router();
const MedicalEmergency = require('../models/MedicalEmergency');
const MedicalFacility = require('../models/MedicalFacility');

// Submit emergency request
router.post('/emergency', async (req, res) => {
  try {
    const {
      patientName,
      age,
      gender,
      condition,
      symptoms,
      severity,
      location,
      contactNumber,
      alternateContact,
      reportedBy,
      latitude,
      longitude
    } = req.body;

    if (!patientName || !age || !condition || !location || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Required fields: patientName, age, condition, location, contactNumber'
      });
    }

    const emergency = new MedicalEmergency({
      reportedBy: reportedBy || null,
      patientName,
      age,
      gender,
      condition,
      symptoms,
      severity: severity || 'medium',
      status: 'pending',
      location: {
        address: location,
        coordinates: latitude && longitude ? {
          type: 'Point',
          coordinates: [longitude, latitude]
        } : undefined
      },
      contactNumber,
      alternateContact
    });

    await emergency.save();

    // Find nearest medical facility
    if (latitude && longitude) {
      const nearestFacility = await findNearestFacility(longitude, latitude);
      if (nearestFacility) {
        emergency.assignedTo = { facility: nearestFacility._id };
        await emergency.save();
      }
    }

    res.json({
      success: true,
      message: 'Emergency request submitted successfully',
      data: emergency
    });
  } catch (error) {
    console.error('Error submitting emergency:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting emergency request',
      error: error.message
    });
  }
});

// Get all emergencies
router.get('/emergencies', async (req, res) => {
  try {
    const { status, severity, limit = 50, skip = 0 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (severity) query.severity = severity;

    const emergencies = await MedicalEmergency.find(query)
      .populate('reportedBy', 'name email')
      .populate('assignedTo.facility')
      .sort({ 'responseTime.reported': -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await MedicalEmergency.countDocuments(query);

    res.json({
      success: true,
      data: emergencies,
      total
    });
  } catch (error) {
    console.error('Error fetching emergencies:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching emergencies',
      error: error.message
    });
  }
});

// Get single emergency
router.get('/emergency/:id', async (req, res) => {
  try {
    const emergency = await MedicalEmergency.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('assignedTo.facility');

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    res.json({
      success: true,
      data: emergency
    });
  } catch (error) {
    console.error('Error fetching emergency:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency',
      error: error.message
    });
  }
});

// Update emergency status
router.patch('/emergency/:id/status', async (req, res) => {
  try {
    const { status } = req.body;

    const updateData = { status };
    const currentTime = new Date();

    if (status === 'dispatched' && !req.body.dispatched) {
      updateData['responseTime.dispatched'] = currentTime;
    } else if (status === 'treating' && !req.body.arrived) {
      updateData['responseTime.arrived'] = currentTime;
    } else if (status === 'resolved' && !req.body.resolved) {
      updateData['responseTime.resolved'] = currentTime;
    }

    const emergency = await MedicalEmergency.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('assignedTo.facility');

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    res.json({
      success: true,
      message: 'Emergency status updated successfully',
      data: emergency
    });
  } catch (error) {
    console.error('Error updating emergency status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating emergency status',
      error: error.message
    });
  }
});

// Add note to emergency
router.post('/emergency/:id/note', async (req, res) => {
  try {
    const { text, addedBy } = req.body;

    const emergency = await MedicalEmergency.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          notes: {
            text,
            addedBy,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency not found'
      });
    }

    res.json({
      success: true,
      message: 'Note added successfully',
      data: emergency
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding note',
      error: error.message
    });
  }
});

// Get all medical facilities
router.get('/facilities', async (req, res) => {
  try {
    const { type, status, city } = req.query;
    
    const query = { isActive: true };
    if (type) query.type = type;
    if (status) query.status = status;
    if (city) query['location.city'] = city;

    const facilities = await MedicalFacility.find(query).sort({ name: 1 });

    res.json({
      success: true,
      data: facilities
    });
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching medical facilities',
      error: error.message
    });
  }
});

// Get single facility
router.get('/facility/:id', async (req, res) => {
  try {
    const facility = await MedicalFacility.findById(req.params.id);

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      data: facility
    });
  } catch (error) {
    console.error('Error fetching facility:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching facility',
      error: error.message
    });
  }
});

// Create/Update medical facility
router.post('/facility', async (req, res) => {
  try {
    const facilityData = req.body;

    const facility = new MedicalFacility(facilityData);
    await facility.save();

    res.json({
      success: true,
      message: 'Medical facility created successfully',
      data: facility
    });
  } catch (error) {
    console.error('Error creating facility:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating medical facility',
      error: error.message
    });
  }
});

// Update facility capacity
router.patch('/facility/:id/capacity', async (req, res) => {
  try {
    const { available, icu, general } = req.body;

    const facility = await MedicalFacility.findByIdAndUpdate(
      req.params.id,
      {
        'capacity.available': available,
        'capacity.icu': icu,
        'capacity.general': general,
        lastUpdated: new Date()
      },
      { new: true }
    );

    if (!facility) {
      return res.status(404).json({
        success: false,
        message: 'Facility not found'
      });
    }

    res.json({
      success: true,
      message: 'Facility capacity updated',
      data: facility
    });
  } catch (error) {
    console.error('Error updating facility capacity:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating facility capacity',
      error: error.message
    });
  }
});

// Get nearby facilities
router.get('/facilities/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 5000, type } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const query = {
      isActive: true,
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    };

    if (type) query.type = type;

    const facilities = await MedicalFacility.find(query).limit(10);

    res.json({
      success: true,
      data: facilities,
      count: facilities.length
    });
  } catch (error) {
    console.error('Error fetching nearby facilities:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching nearby facilities',
      error: error.message
    });
  }
});

// Get medical statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalEmergencies,
      pendingEmergencies,
      resolvedEmergencies,
      criticalCases,
      totalFacilities,
      availableBeds
    ] = await Promise.all([
      MedicalEmergency.countDocuments(),
      MedicalEmergency.countDocuments({ status: 'pending' }),
      MedicalEmergency.countDocuments({ status: 'resolved' }),
      MedicalEmergency.countDocuments({ severity: 'critical', status: { $ne: 'resolved' } }),
      MedicalFacility.countDocuments({ isActive: true }),
      MedicalFacility.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$capacity.available' } } }
      ])
    ]);

    const avgResponseTime = await MedicalEmergency.aggregate([
      {
        $match: {
          'responseTime.dispatched': { $exists: true },
          'responseTime.arrived': { $exists: true }
        }
      },
      {
        $project: {
          responseTime: {
            $subtract: ['$responseTime.arrived', '$responseTime.dispatched']
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$responseTime' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalEmergencies,
        pendingEmergencies,
        resolvedEmergencies,
        criticalCases,
        totalFacilities,
        availableBeds: availableBeds[0]?.total || 0,
        avgResponseTimeMinutes: avgResponseTime[0] ? Math.round(avgResponseTime[0].avgTime / 60000) : 0
      }
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Helper function to find nearest facility
async function findNearestFacility(longitude, latitude) {
  try {
    const facilities = await MedicalFacility.find({
      isActive: true,
      status: { $nin: ['full', 'closed'] },
      'location.coordinates.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 10000 // 10km
        }
      }
    }).limit(1);

    return facilities[0] || null;
  } catch (error) {
    console.error('Error finding nearest facility:', error);
    return null;
  }
}

module.exports = router;
