const express = require('express');
const router = express.Router();
const Parking = require('../models/Parking');

// @route   GET /api/parking
// @desc    Get all parking zones
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, type } = req.query;
    let query = {};
    
    if (location) query.location = location;
    if (type && type !== 'all') {
      query.$or = [{ type: type }, { type: 'multi' }];
    }
    
    const parkingZones = await Parking.find(query).sort({ name: 1 });
    res.json({ success: true, data: parkingZones });
  } catch (error) {
    console.error('Error fetching parking zones:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/parking/stats
// @desc    Get parking statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const { location } = req.query;
    let query = location ? { location } : {};
    
    const zones = await Parking.find(query);
    
    const stats = {
      totalZones: zones.length,
      totalCapacity: zones.reduce((sum, zone) => sum + zone.capacity, 0),
      totalOccupied: zones.reduce((sum, zone) => sum + zone.occupied, 0),
      totalAvailable: zones.reduce((sum, zone) => sum + zone.available, 0),
      byStatus: {
        available: zones.filter(z => z.status === 'available').length,
        filling: zones.filter(z => z.status === 'filling').length,
        full: zones.filter(z => z.status === 'full').length
      }
    };
    
    stats.occupancyRate = ((stats.totalOccupied / stats.totalCapacity) * 100).toFixed(1);
    
    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching parking stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/parking
// @desc    Create new parking zone
// @access  Public
router.post('/', async (req, res) => {
  try {
    const parking = new Parking(req.body);
    await parking.save();
    res.json({ success: true, data: parking });
  } catch (error) {
    console.error('Error creating parking zone:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/parking/:id
// @desc    Update parking zone occupancy
// @access  Public
router.put('/:id', async (req, res) => {
  try {
    const { occupied } = req.body;
    const parking = await Parking.findByIdAndUpdate(
      req.params.id,
      { occupied },
      { new: true, runValidators: true }
    );
    
    if (!parking) {
      return res.status(404).json({ success: false, error: 'Parking zone not found' });
    }
    
    res.json({ success: true, data: parking });
  } catch (error) {
    console.error('Error updating parking zone:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/parking/:id
// @desc    Delete parking zone
// @access  Public
router.delete('/:id', async (req, res) => {
  try {
    const parking = await Parking.findByIdAndDelete(req.params.id);
    
    if (!parking) {
      return res.status(404).json({ success: false, error: 'Parking zone not found' });
    }
    
    res.json({ success: true, message: 'Parking zone deleted' });
  } catch (error) {
    console.error('Error deleting parking zone:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
