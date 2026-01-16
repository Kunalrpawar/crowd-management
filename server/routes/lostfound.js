const express = require('express');
const router = express.Router();
const LostFound = require('../models/LostFound');

// Report a missing person
router.post('/report-missing', async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      description,
      lastSeenLocation,
      contactNumber,
      alternateContact,
      clothingDescription,
      identificationMarks,
      photo,
      reportedBy,
      latitude,
      longitude
    } = req.body;

    if (!name || !contactNumber || !lastSeenLocation) {
      return res.status(400).json({
        success: false,
        message: 'Name, contact number, and last seen location are required'
      });
    }

    const missingCase = new LostFound({
      reportedBy: reportedBy || null,
      type: 'missing',
      status: 'active',
      name,
      age,
      gender,
      description,
      lastSeenLocation,
      contactNumber,
      alternateContact,
      clothingDescription,
      identificationMarks,
      photo,
      location: latitude && longitude ? {
        type: 'Point',
        coordinates: [longitude, latitude]
      } : undefined
    });

    await missingCase.save();

    const potentialMatches = await findPotentialMatches(missingCase);

    res.json({
      success: true,
      message: 'Missing person report filed successfully',
      data: {
        case: missingCase,
        potentialMatches: potentialMatches.length > 0 ? potentialMatches : null
      }
    });
  } catch (error) {
    console.error('Error filing missing person report:', error);
    res.status(500).json({
      success: false,
      message: 'Error filing missing person report',
      error: error.message
    });
  }
});

// Report a found person
router.post('/report-found', async (req, res) => {
  try {
    const {
      description,
      currentLocation,
      contactNumber,
      alternateContact,
      approximateAge,
      gender,
      clothingDescription,
      condition,
      photo,
      reportedBy,
      latitude,
      longitude
    } = req.body;

    if (!currentLocation || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Current location and contact number are required'
      });
    }

    const foundCase = new LostFound({
      reportedBy: reportedBy || null,
      type: 'found',
      status: 'active',
      approximateAge,
      gender,
      description,
      currentLocation,
      contactNumber,
      alternateContact,
      clothingDescription,
      photo,
      additionalInfo: condition,
      location: latitude && longitude ? {
        type: 'Point',
        coordinates: [longitude, latitude]
      } : undefined
    });

    await foundCase.save();

    const potentialMatches = await findPotentialMatchesForFound(foundCase);

    res.json({
      success: true,
      message: 'Found person report filed successfully',
      data: {
        case: foundCase,
        potentialMatches: potentialMatches.length > 0 ? potentialMatches : null
      }
    });
  } catch (error) {
    console.error('Error filing found person report:', error);
    res.status(500).json({
      success: false,
      message: 'Error filing found person report',
      error: error.message
    });
  }
});

// Get all missing persons
router.get('/missing', async (req, res) => {
  try {
    const { status = 'active', limit = 50, skip = 0 } = req.query;
    
    const missingPersons = await LostFound.find({
      type: 'missing',
      ...(status && { status })
    })
    .populate('reportedBy', 'name email')
    .sort({ reportedAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

    const total = await LostFound.countDocuments({ type: 'missing', status });

    res.json({
      success: true,
      data: missingPersons,
      total
    });
  } catch (error) {
    console.error('Error fetching missing persons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching missing persons',
      error: error.message
    });
  }
});

// Get all found persons
router.get('/found', async (req, res) => {
  try {
    const { status = 'active', limit = 50, skip = 0 } = req.query;
    
    const foundPersons = await LostFound.find({
      type: 'found',
      ...(status && { status })
    })
    .populate('reportedBy', 'name email')
    .sort({ reportedAt: -1 })
    .limit(parseInt(limit))
    .skip(parseInt(skip));

    const total = await LostFound.countDocuments({ type: 'found', status });

    res.json({
      success: true,
      data: foundPersons,
      total
    });
  } catch (error) {
    console.error('Error fetching found persons:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching found persons',
      error: error.message
    });
  }
});

// Get case by ID
router.get('/case/:id', async (req, res) => {
  try {
    const caseData = await LostFound.findById(req.params.id)
      .populate('reportedBy', 'name email phone')
      .populate('matchedWith');

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.json({
      success: true,
      data: caseData
    });
  } catch (error) {
    console.error('Error fetching case:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching case',
      error: error.message
    });
  }
});

// Update case status
router.patch('/case/:id/status', async (req, res) => {
  try {
    const { status, matchedWith } = req.body;

    const updateData = { status };
    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      if (matchedWith) {
        updateData.matchedWith = matchedWith;
      }
    }

    const caseData = await LostFound.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!caseData) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    res.json({
      success: true,
      message: 'Case status updated successfully',
      data: caseData
    });
  } catch (error) {
    console.error('Error updating case status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating case status',
      error: error.message
    });
  }
});

// Get statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalMissing,
      totalFound,
      activeMissing,
      activeFound,
      resolved
    ] = await Promise.all([
      LostFound.countDocuments({ type: 'missing' }),
      LostFound.countDocuments({ type: 'found' }),
      LostFound.countDocuments({ type: 'missing', status: 'active' }),
      LostFound.countDocuments({ type: 'found', status: 'active' }),
      LostFound.countDocuments({ status: 'resolved' })
    ]);

    res.json({
      success: true,
      data: {
        totalMissing,
        totalFound,
        activeMissing,
        activeFound,
        resolved
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

// Helper functions
async function findPotentialMatches(missingCase) {
  try {
    const foundPersons = await LostFound.find({
      type: 'found',
      status: 'active',
      gender: missingCase.gender
    }).limit(10);

    const matches = [];
    
    for (const found of foundPersons) {
      let score = 0;
      
      if (found.approximateAge && missingCase.age) {
        const ageRange = parseInt(found.approximateAge.match(/\d+/)?.[0] || 0);
        if (Math.abs(ageRange - missingCase.age) <= 5) score += 30;
      }
      
      if (found.clothingDescription && missingCase.clothingDescription) {
        const clothingWords = missingCase.clothingDescription.toLowerCase().split(' ');
        const foundClothing = found.clothingDescription.toLowerCase();
        clothingWords.forEach(word => {
          if (foundClothing.includes(word)) score += 20;
        });
      }
      
      if (found.currentLocation && missingCase.lastSeenLocation) {
        if (found.currentLocation.toLowerCase().includes(missingCase.lastSeenLocation.toLowerCase()) ||
            missingCase.lastSeenLocation.toLowerCase().includes(found.currentLocation.toLowerCase())) {
          score += 40;
        }
      }
      
      if (score >= 40) {
        matches.push({ ...found.toObject(), matchScore: score });
      }
    }
    
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
}

async function findPotentialMatchesForFound(foundCase) {
  try {
    const missingPersons = await LostFound.find({
      type: 'missing',
      status: 'active',
      gender: foundCase.gender
    }).limit(10);

    const matches = [];
    
    for (const missing of missingPersons) {
      let score = 0;
      
      if (foundCase.approximateAge && missing.age) {
        const ageRange = parseInt(foundCase.approximateAge.match(/\d+/)?.[0] || 0);
        if (Math.abs(ageRange - missing.age) <= 5) score += 30;
      }
      
      if (foundCase.clothingDescription && missing.clothingDescription) {
        const clothingWords = missing.clothingDescription.toLowerCase().split(' ');
        const foundClothing = foundCase.clothingDescription.toLowerCase();
        clothingWords.forEach(word => {
          if (foundClothing.includes(word)) score += 20;
        });
      }
      
      if (foundCase.currentLocation && missing.lastSeenLocation) {
        if (foundCase.currentLocation.toLowerCase().includes(missing.lastSeenLocation.toLowerCase()) ||
            missing.lastSeenLocation.toLowerCase().includes(foundCase.currentLocation.toLowerCase())) {
          score += 40;
        }
      }
      
      if (score >= 40) {
        matches.push({ ...missing.toObject(), matchScore: score });
      }
    }
    
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  } catch (error) {
    console.error('Error finding matches:', error);
    return [];
  }
}

module.exports = router;
