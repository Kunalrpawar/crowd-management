const express = require('express');
const router = express.Router();

// In-memory storage (replace with database in production)
let missingPersons = [];
let foundPersons = [];
let matchedCases = [];
let caseIdCounter = 1;

// Report a missing person
router.post('/report-missing', (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      description,
      lastSeenLocation,
      lastSeenTime,
      contactNumber,
      photoUrl,
      clothingDescription,
      identificationMarks,
      reportedBy
    } = req.body;

    if (!name || !contactNumber || !lastSeenLocation) {
      return res.status(400).json({
        success: false,
        message: 'Name, contact number, and last seen location are required'
      });
    }

    const missingCase = {
      id: caseIdCounter++,
      name,
      age: age || 'Unknown',
      gender: gender || 'Unknown',
      description: description || '',
      lastSeenLocation,
      lastSeenTime: lastSeenTime || new Date().toISOString(),
      contactNumber,
      photoUrl: photoUrl || '',
      clothingDescription: clothingDescription || '',
      identificationMarks: identificationMarks || '',
      reportedBy: reportedBy || 'Anonymous',
      reportedAt: new Date().toISOString(),
      status: 'missing',
      views: 0,
      tips: []
    };

    missingPersons.push(missingCase);

    // Check for potential matches with found persons
    const potentialMatches = findPotentialMatches(missingCase);

    res.json({
      success: true,
      message: 'Missing person report filed successfully',
      data: {
        case: missingCase,
        potentialMatches: potentialMatches.length > 0 ? potentialMatches : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filing missing person report',
      error: error.message
    });
  }
});

// Report a found person
router.post('/report-found', (req, res) => {
  try {
    const {
      description,
      currentLocation,
      foundTime,
      contactNumber,
      photoUrl,
      approximateAge,
      gender,
      clothingDescription,
      condition,
      foundBy
    } = req.body;

    if (!currentLocation || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Current location and contact number are required'
      });
    }

    const foundCase = {
      id: caseIdCounter++,
      description: description || '',
      currentLocation,
      foundTime: foundTime || new Date().toISOString(),
      contactNumber,
      photoUrl: photoUrl || '',
      approximateAge: approximateAge || 'Unknown',
      gender: gender || 'Unknown',
      clothingDescription: clothingDescription || '',
      condition: condition || 'Safe',
      foundBy: foundBy || 'Anonymous',
      reportedAt: new Date().toISOString(),
      status: 'found',
      claimed: false
    };

    foundPersons.push(foundCase);

    // Check for potential matches with missing persons
    const potentialMatches = findMatchesForFound(foundCase);

    res.json({
      success: true,
      message: 'Found person report filed successfully',
      data: {
        case: foundCase,
        potentialMatches: potentialMatches.length > 0 ? potentialMatches : null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error filing found person report',
      error: error.message
    });
  }
});

// Get all missing persons
router.get('/missing', (req, res) => {
  try {
    const { status, location, gender } = req.query;
    
    let filtered = [...missingPersons];

    if (status) {
      filtered = filtered.filter(p => p.status === status);
    }
    if (location) {
      filtered = filtered.filter(p => 
        p.lastSeenLocation.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (gender) {
      filtered = filtered.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching missing persons',
      error: error.message
    });
  }
});

// Get all found persons
router.get('/found', (req, res) => {
  try {
    const { claimed, location, gender } = req.query;
    
    let filtered = [...foundPersons];

    if (claimed !== undefined) {
      filtered = filtered.filter(p => p.claimed === (claimed === 'true'));
    }
    if (location) {
      filtered = filtered.filter(p => 
        p.currentLocation.toLowerCase().includes(location.toLowerCase())
      );
    }
    if (gender) {
      filtered = filtered.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching found persons',
      error: error.message
    });
  }
});

// Get specific case details
router.get('/case/:id', (req, res) => {
  try {
    const { id } = req.params;
    const caseId = parseInt(id);

    const missingCase = missingPersons.find(p => p.id === caseId);
    if (missingCase) {
      missingCase.views++;
      return res.json({
        success: true,
        data: missingCase,
        type: 'missing'
      });
    }

    const foundCase = foundPersons.find(p => p.id === caseId);
    if (foundCase) {
      return res.json({
        success: true,
        data: foundCase,
        type: 'found'
      });
    }

    res.status(404).json({
      success: false,
      message: 'Case not found'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching case details',
      error: error.message
    });
  }
});

// Add a tip to a missing person case
router.post('/case/:id/tip', (req, res) => {
  try {
    const { id } = req.params;
    const { tipText, location, contactNumber, timestamp } = req.body;
    const caseId = parseInt(id);

    const missingCase = missingPersons.find(p => p.id === caseId);
    if (!missingCase) {
      return res.status(404).json({
        success: false,
        message: 'Case not found'
      });
    }

    const tip = {
      id: Date.now(),
      tipText,
      location: location || '',
      contactNumber: contactNumber || '',
      timestamp: timestamp || new Date().toISOString(),
      verified: false
    };

    missingCase.tips.push(tip);

    res.json({
      success: true,
      message: 'Tip added successfully',
      data: tip
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding tip',
      error: error.message
    });
  }
});

// Mark a case as resolved/reunited
router.put('/case/:id/resolve', (req, res) => {
  try {
    const { id } = req.params;
    const { reunificationDetails } = req.body;
    const caseId = parseInt(id);

    const missingCase = missingPersons.find(p => p.id === caseId);
    if (missingCase) {
      missingCase.status = 'reunited';
      missingCase.reunificationDetails = reunificationDetails || '';
      missingCase.resolvedAt = new Date().toISOString();
      
      matchedCases.push(missingCase);
      
      return res.json({
        success: true,
        message: 'Case marked as resolved',
        data: missingCase
      });
    }

    const foundCase = foundPersons.find(p => p.id === caseId);
    if (foundCase) {
      foundCase.claimed = true;
      foundCase.claimedAt = new Date().toISOString();
      
      return res.json({
        success: true,
        message: 'Found person claimed',
        data: foundCase
      });
    }

    res.status(404).json({
      success: false,
      message: 'Case not found'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resolving case',
      error: error.message
    });
  }
});

// Search across all cases
router.get('/search', (req, res) => {
  try {
    const { query, age, gender, location } = req.query;

    if (!query && !age && !gender && !location) {
      return res.status(400).json({
        success: false,
        message: 'At least one search parameter is required'
      });
    }

    let results = [];

    // Search in missing persons
    const missingResults = missingPersons.filter(person => {
      let matches = true;
      
      if (query) {
        const searchLower = query.toLowerCase();
        matches = matches && (
          person.name.toLowerCase().includes(searchLower) ||
          person.description.toLowerCase().includes(searchLower) ||
          person.clothingDescription.toLowerCase().includes(searchLower)
        );
      }
      
      if (age) {
        matches = matches && (person.age.toString() === age.toString());
      }
      
      if (gender) {
        matches = matches && (person.gender.toLowerCase() === gender.toLowerCase());
      }
      
      if (location) {
        matches = matches && person.lastSeenLocation.toLowerCase().includes(location.toLowerCase());
      }
      
      return matches;
    }).map(p => ({ ...p, caseType: 'missing' }));

    // Search in found persons
    const foundResults = foundPersons.filter(person => {
      let matches = true;
      
      if (query) {
        const searchLower = query.toLowerCase();
        matches = matches && (
          person.description.toLowerCase().includes(searchLower) ||
          person.clothingDescription.toLowerCase().includes(searchLower)
        );
      }
      
      if (age) {
        matches = matches && (person.approximateAge.toString() === age.toString());
      }
      
      if (gender) {
        matches = matches && (person.gender.toLowerCase() === gender.toLowerCase());
      }
      
      if (location) {
        matches = matches && person.currentLocation.toLowerCase().includes(location.toLowerCase());
      }
      
      return matches;
    }).map(p => ({ ...p, caseType: 'found' }));

    results = [...missingResults, ...foundResults];

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching cases',
      error: error.message
    });
  }
});

// Get statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalMissingCases: missingPersons.length,
      activeMissingCases: missingPersons.filter(p => p.status === 'missing').length,
      totalFoundCases: foundPersons.length,
      unclaimedFoundCases: foundPersons.filter(p => !p.claimed).length,
      reunited: missingPersons.filter(p => p.status === 'reunited').length,
      totalTips: missingPersons.reduce((sum, p) => sum + p.tips.length, 0),
      recentCases: [
        ...missingPersons.slice(-5).map(p => ({ ...p, type: 'missing' })),
        ...foundPersons.slice(-5).map(p => ({ ...p, type: 'found' }))
      ].sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt)).slice(0, 10)
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

// Helper function to find potential matches
function findPotentialMatches(missingCase) {
  return foundPersons.filter(found => {
    if (found.claimed) return false;
    
    let matchScore = 0;
    
    // Gender match
    if (found.gender.toLowerCase() === missingCase.gender.toLowerCase()) {
      matchScore += 30;
    }
    
    // Age proximity (within 5 years)
    if (Math.abs(parseInt(found.approximateAge) - parseInt(missingCase.age)) <= 5) {
      matchScore += 20;
    }
    
    // Location proximity (simple string matching)
    if (found.currentLocation.toLowerCase().includes(missingCase.lastSeenLocation.toLowerCase()) ||
        missingCase.lastSeenLocation.toLowerCase().includes(found.currentLocation.toLowerCase())) {
      matchScore += 30;
    }
    
    // Clothing description similarity
    if (found.clothingDescription && missingCase.clothingDescription) {
      const foundClothing = found.clothingDescription.toLowerCase();
      const missingClothing = missingCase.clothingDescription.toLowerCase();
      const commonWords = foundClothing.split(' ').filter(word => 
        missingClothing.includes(word) && word.length > 3
      );
      matchScore += commonWords.length * 5;
    }
    
    return matchScore >= 40; // Return matches with score >= 40%
  }).map(found => ({
    ...found,
    matchType: 'found-person'
  }));
}

// Helper function to find matches for found persons
function findMatchesForFound(foundCase) {
  return missingPersons.filter(missing => {
    if (missing.status !== 'missing') return false;
    
    let matchScore = 0;
    
    if (foundCase.gender.toLowerCase() === missing.gender.toLowerCase()) {
      matchScore += 30;
    }
    
    if (Math.abs(parseInt(foundCase.approximateAge) - parseInt(missing.age)) <= 5) {
      matchScore += 20;
    }
    
    if (foundCase.currentLocation.toLowerCase().includes(missing.lastSeenLocation.toLowerCase()) ||
        missing.lastSeenLocation.toLowerCase().includes(foundCase.currentLocation.toLowerCase())) {
      matchScore += 30;
    }
    
    if (foundCase.clothingDescription && missing.clothingDescription) {
      const foundClothing = foundCase.clothingDescription.toLowerCase();
      const missingClothing = missing.clothingDescription.toLowerCase();
      const commonWords = foundClothing.split(' ').filter(word => 
        missingClothing.includes(word) && word.length > 3
      );
      matchScore += commonWords.length * 5;
    }
    
    return matchScore >= 40;
  }).map(missing => ({
    ...missing,
    matchType: 'missing-person'
  }));
}

module.exports = router;
