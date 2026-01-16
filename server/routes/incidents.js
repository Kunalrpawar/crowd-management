const express = require('express');
const router = express.Router();
const Incident = require('../models/Incident');

// @route   GET /api/incidents
// @desc    Get all incidents
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, type, severity, status } = req.query;
    let query = {};
    
    if (city) query['location.city'] = city;
    if (type) query.type = type;
    if (severity) query.severity = severity;
    if (status) query.status = status;
    
    const incidents = await Incident.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: incidents });
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/incidents/stats
// @desc    Get incident statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const { city } = req.query;
    let query = city ? { 'location.city': city } : {};
    
    const incidents = await Incident.find(query);
    
    const stats = {
      total: incidents.length,
      bySeverity: {
        critical: incidents.filter(i => i.severity === 'critical').length,
        high: incidents.filter(i => i.severity === 'high').length,
        medium: incidents.filter(i => i.severity === 'medium').length,
        low: incidents.filter(i => i.severity === 'low').length
      },
      byStatus: {
        reported: incidents.filter(i => i.status === 'reported').length,
        acknowledged: incidents.filter(i => i.status === 'acknowledged').length,
        in_progress: incidents.filter(i => i.status === 'in_progress').length,
        resolved: incidents.filter(i => i.status === 'resolved').length,
        closed: incidents.filter(i => i.status === 'closed').length
      },
      byType: {
        medical: incidents.filter(i => i.type === 'medical').length,
        crowd_surge: incidents.filter(i => i.type === 'crowd_surge').length,
        infrastructure: incidents.filter(i => i.type === 'infrastructure').length,
        security: incidents.filter(i => i.type === 'security').length,
        water_sanitation: incidents.filter(i => i.type === 'water_sanitation').length,
        fire: incidents.filter(i => i.type === 'fire').length,
        other: incidents.filter(i => i.type === 'other').length
      }
    };
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching incident stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/incidents
// @desc    Report new incident
// @access  Public
router.post('/', async (req, res) => {
  try {
    const incident = new Incident(req.body);
    await incident.save();
    
    // Emit socket event for real-time updates
    if (req.app.get('io')) {
      req.app.get('io').emit('newIncident', incident);
    }
    
    res.json({ success: true, data: incident });
  } catch (error) {
    console.error('Error creating incident:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/incidents/:id
// @desc    Update incident status
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const updates = req.body;
    
    if (updates.status === 'resolved' && !updates.resolvedAt) {
      updates.resolvedAt = Date.now();
    }
    
    const incident = await Incident.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );
    
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    
    // Emit socket event for real-time updates
    if (req.app.get('io')) {
      req.app.get('io').emit('incidentUpdated', incident);
    }
    
    res.json({ success: true, data: incident });
  } catch (error) {
    console.error('Error updating incident:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/incidents/:id/notes
// @desc    Add note to incident
// @access  Public
router.post('/:id/notes', async (req, res) => {
  try {
    const { note, addedBy } = req.body;
    
    const incident = await Incident.findById(req.params.id);
    
    if (!incident) {
      return res.status(404).json({ success: false, error: 'Incident not found' });
    }
    
    incident.notes.push({ note, addedBy });
    await incident.save();
    
    res.json({ success: true, data: incident });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
