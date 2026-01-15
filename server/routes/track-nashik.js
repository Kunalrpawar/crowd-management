const express = require('express');
const router = express.Router();

// Route Types for Kumbh Mela Management
const routeTypes = {
  BLACK: 'black', // Closed during Parvani days
  VIP: 'vip', // For VIPs and dignitaries
  EMERGENCY: 'emergency', // Emergency services only
  SNANI: 'snani', // Bathing route for pilgrims
  ADMINISTRATIVE: 'administrative', // For officials
  INTERNAL_PARKING: 'internal_parking', // Internal parking zones
  EXTERNAL_PARKING: 'external_parking', // External parking zones
  GENERAL: 'general' // General public routes
};

// Dynamic route status based on events and days
let routeStatuses = {
  parvaniDay: false, // Parvani (special bathing) day status
  currentEvent: null,
  lastUpdated: new Date().toISOString()
};

// Route definitions with all locations
let routes = [
  // Prayagraj Routes
  {
    id: 1,
    name: 'Sangam Nose Direct Route',
    location: 'prayagraj',
    type: routeTypes.SNANI,
    start: { lat: 25.4358, lng: 81.8463, name: 'Sector 1 Entry' },
    end: { lat: 25.4198, lng: 81.8343, name: 'Sangam Nose' },
    waypoints: [
      { lat: 25.4298, lng: 81.8403, name: 'Checkpoint A' },
      { lat: 25.4248, lng: 81.8373, name: 'Security Point 1' }
    ],
    status: 'open',
    crowdLevel: 'medium',
    capacity: 50000,
    currentLoad: 35000,
    distance: 3.2,
    estimatedTime: 45,
    facilities: ['Medical Station', 'Water Points', 'Security'],
    restrictions: 'No vehicles, pedestrians only'
  },
  {
    id: 2,
    name: 'VIP Corridor',
    location: 'prayagraj',
    type: routeTypes.VIP,
    start: { lat: 25.4458, lng: 81.8563, name: 'VIP Gate' },
    end: { lat: 25.4198, lng: 81.8343, name: 'Sangam VIP Area' },
    waypoints: [
      { lat: 25.4398, lng: 81.8493, name: 'VIP Checkpoint' },
      { lat: 25.4298, lng: 81.8423, name: 'Security Clearance' }
    ],
    status: 'restricted',
    crowdLevel: 'low',
    capacity: 5000,
    currentLoad: 1200,
    distance: 4.5,
    estimatedTime: 20,
    facilities: ['VIP Lounge', 'Security', 'Medical'],
    restrictions: 'VIP Pass Required'
  },
  {
    id: 3,
    name: 'Emergency Access Road',
    location: 'prayagraj',
    type: routeTypes.EMERGENCY,
    start: { lat: 25.4518, lng: 81.8583, name: 'Emergency Base' },
    end: { lat: 25.4198, lng: 81.8343, name: 'All Zones' },
    waypoints: [
      { lat: 25.4418, lng: 81.8483, name: 'Fire Station' },
      { lat: 25.4298, lng: 81.8403, name: 'Medical Hub' }
    ],
    status: 'open',
    crowdLevel: 'low',
    capacity: 1000,
    currentLoad: 50,
    distance: 5.1,
    estimatedTime: 15,
    facilities: ['Ambulance Points', 'Fire Station', 'Police'],
    restrictions: 'Emergency Vehicles Only'
  },
  {
    id: 4,
    name: 'Administrative Route',
    location: 'prayagraj',
    type: routeTypes.ADMINISTRATIVE,
    start: { lat: 25.4488, lng: 81.8533, name: 'Admin Office' },
    end: { lat: 25.4288, lng: 81.8403, name: 'Control Room' },
    waypoints: [
      { lat: 25.4388, lng: 81.8468, name: 'Police HQ' }
    ],
    status: 'open',
    crowdLevel: 'low',
    capacity: 2000,
    currentLoad: 800,
    distance: 3.8,
    estimatedTime: 25,
    facilities: ['Admin Offices', 'Control Centers'],
    restrictions: 'Officials Only'
  },
  {
    id: 5,
    name: 'Black Route - Parvani Closure',
    location: 'prayagraj',
    type: routeTypes.BLACK,
    start: { lat: 25.4358, lng: 81.8463, name: 'Sector 2' },
    end: { lat: 25.4228, lng: 81.8363, name: 'Restricted Zone' },
    waypoints: [
      { lat: 25.4293, lng: 81.8413, name: 'Barricade Point' }
    ],
    status: 'closed',
    crowdLevel: 'none',
    capacity: 30000,
    currentLoad: 0,
    distance: 2.8,
    estimatedTime: 0,
    facilities: [],
    restrictions: 'Closed during Parvani Days',
    closureReason: 'Special bathing ceremony - safety measure'
  },

  // Nashik Routes
  {
    id: 6,
    name: 'Ramkund Bathing Route',
    location: 'nashik',
    type: routeTypes.SNANI,
    start: { lat: 19.9975, lng: 73.7898, name: 'Main Entry Nashik' },
    end: { lat: 20.0075, lng: 73.7798, name: 'Ramkund' },
    waypoints: [
      { lat: 20.0025, lng: 73.7848, name: 'Security Gate 1' },
      { lat: 20.0050, lng: 73.7823, name: 'Medical Point' }
    ],
    status: 'open',
    crowdLevel: 'high',
    capacity: 40000,
    currentLoad: 32000,
    distance: 2.5,
    estimatedTime: 40,
    facilities: ['Medical', 'Water', 'Security'],
    restrictions: 'Pedestrian only during peak hours'
  },
  {
    id: 7,
    name: 'Nashik Private Ambulance Route',
    location: 'nashik',
    type: routeTypes.EMERGENCY,
    start: { lat: 19.9975, lng: 73.7898, name: 'Private Medical Center' },
    end: { lat: 20.0075, lng: 73.7798, name: 'All Hospitals' },
    waypoints: [
      { lat: 20.0025, lng: 73.7848, name: 'Private Pharmacy Hub' }
    ],
    status: 'open',
    crowdLevel: 'low',
    capacity: 500,
    currentLoad: 45,
    distance: 3.2,
    estimatedTime: 12,
    facilities: ['Private Ambulances', 'Medical Pharmacies'],
    restrictions: 'Medical Emergency Only'
  },

  // Haridwar Routes
  {
    id: 8,
    name: 'Har Ki Pauri Main Route',
    location: 'haridwar',
    type: routeTypes.SNANI,
    start: { lat: 29.9457, lng: 78.1642, name: 'Haridwar Entry' },
    end: { lat: 29.9457, lng: 78.1642, name: 'Har Ki Pauri' },
    waypoints: [
      { lat: 29.9507, lng: 78.1592, name: 'Bridge Checkpoint' }
    ],
    status: 'open',
    crowdLevel: 'medium',
    capacity: 35000,
    currentLoad: 22000,
    distance: 1.8,
    estimatedTime: 30,
    facilities: ['Medical', 'Security', 'Water'],
    restrictions: 'No vehicles near ghats'
  },

  // Ujjain Routes
  {
    id: 9,
    name: 'Ram Ghat Access Route',
    location: 'ujjain',
    type: routeTypes.SNANI,
    start: { lat: 23.1765, lng: 75.7885, name: 'Ujjain Main Gate' },
    end: { lat: 23.1865, lng: 75.7785, name: 'Ram Ghat' },
    waypoints: [
      { lat: 23.1815, lng: 75.7835, name: 'Mahakal Checkpoint' }
    ],
    status: 'open',
    crowdLevel: 'medium',
    capacity: 30000,
    currentLoad: 18000,
    distance: 2.2,
    estimatedTime: 35,
    facilities: ['Medical', 'Security'],
    restrictions: 'Respect temple timings'
  }
];

// Parking Zones
let parkingZones = [
  // Prayagraj Parking
  { id: 1, name: 'Internal Parking Zone A', location: 'prayagraj', type: 'internal', lat: 25.4458, lng: 81.8563, capacity: 5000, occupied: 3200, vehicleTypes: ['Car', 'Two-wheeler'] },
  { id: 2, name: 'External Parking Zone 1', location: 'prayagraj', type: 'external', lat: 25.4558, lng: 81.8663, capacity: 15000, occupied: 12500, vehicleTypes: ['Bus', 'Car', 'Two-wheeler'] },
  { id: 3, name: 'VIP Parking', location: 'prayagraj', type: 'vip', lat: 25.4398, lng: 81.8493, capacity: 500, occupied: 320, vehicleTypes: ['Car'] },
  
  // Nashik Parking
  { id: 4, name: 'Nashik Main Parking', location: 'nashik', type: 'external', lat: 19.9875, lng: 73.7998, capacity: 10000, occupied: 7800, vehicleTypes: ['Bus', 'Car', 'Two-wheeler'] },
  
  // Haridwar Parking
  { id: 5, name: 'Haridwar Central Parking', location: 'haridwar', type: 'external', lat: 29.9557, lng: 78.1742, capacity: 8000, occupied: 5600, vehicleTypes: ['Bus', 'Car', 'Two-wheeler'] },
  
  // Ujjain Parking
  { id: 6, name: 'Ujjain Temple Parking', location: 'ujjain', type: 'external', lat: 23.1665, lng: 75.7985, capacity: 7000, occupied: 4200, vehicleTypes: ['Car', 'Two-wheeler'] }
];

// Get all routes with optional filters
router.get('/', (req, res) => {
  try {
    const { location, type, status } = req.query;
    
    let filteredRoutes = [...routes];
    
    if (location) {
      filteredRoutes = filteredRoutes.filter(r => r.location === location);
    }
    
    if (type) {
      filteredRoutes = filteredRoutes.filter(r => r.type === type);
    }
    
    if (status) {
      filteredRoutes = filteredRoutes.filter(r => r.status === status);
    }
    
    res.json({
      success: true,
      count: filteredRoutes.length,
      data: filteredRoutes,
      routeTypes: Object.values(routeTypes),
      statusInfo: routeStatuses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching routes',
      error: error.message
    });
  }
});

// Get route by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const route = routes.find(r => r.id === parseInt(id));
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching route',
      error: error.message
    });
  }
});

// Get routes by type
router.get('/type/:type', (req, res) => {
  try {
    const { type } = req.params;
    const filteredRoutes = routes.filter(r => r.type === type);
    
    res.json({
      success: true,
      count: filteredRoutes.length,
      data: filteredRoutes,
      type: type
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching routes by type',
      error: error.message
    });
  }
});

// Update route status (open/closed/restricted)
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;
    
    const route = routes.find(r => r.id === parseInt(id));
    
    if (!route) {
      return res.status(404).json({
        success: false,
        message: 'Route not found'
      });
    }
    
    route.status = status;
    if (reason) route.closureReason = reason;
    
    res.json({
      success: true,
      message: `Route status updated to ${status}`,
      data: route
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating route status',
      error: error.message
    });
  }
});

// Toggle Parvani Day (closes black routes automatically)
router.post('/parvani-toggle', (req, res) => {
  try {
    const { active } = req.body;
    
    routeStatuses.parvaniDay = active;
    routeStatuses.lastUpdated = new Date().toISOString();
    
    // Close/Open black routes based on Parvani day status
    routes.forEach(route => {
      if (route.type === routeTypes.BLACK) {
        route.status = active ? 'closed' : 'open';
        route.currentLoad = active ? 0 : Math.floor(route.capacity * 0.6);
      }
    });
    
    res.json({
      success: true,
      message: `Parvani day ${active ? 'activated' : 'deactivated'}`,
      data: {
        parvaniDay: routeStatuses.parvaniDay,
        affectedRoutes: routes.filter(r => r.type === routeTypes.BLACK)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling Parvani day',
      error: error.message
    });
  }
});

// Get parking zones
router.get('/parking/zones', (req, res) => {
  try {
    const { location, type } = req.query;
    
    let filteredZones = [...parkingZones];
    
    if (location) {
      filteredZones = filteredZones.filter(z => z.location === location);
    }
    
    if (type) {
      filteredZones = filteredZones.filter(z => z.type === type);
    }
    
    const totalCapacity = parkingZones.reduce((sum, z) => sum + z.capacity, 0);
    const totalOccupied = parkingZones.reduce((sum, z) => sum + z.occupied, 0);
    
    res.json({
      success: true,
      count: filteredZones.length,
      data: filteredZones,
      summary: {
        totalCapacity,
        totalOccupied,
        available: totalCapacity - totalOccupied,
        occupancyRate: Math.round((totalOccupied / totalCapacity) * 100)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching parking zones',
      error: error.message
    });
  }
});

// Update parking zone occupancy
router.patch('/parking/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { occupied } = req.body;
    
    const zone = parkingZones.find(z => z.id === parseInt(id));
    
    if (!zone) {
      return res.status(404).json({
        success: false,
        message: 'Parking zone not found'
      });
    }
    
    zone.occupied = Math.min(occupied, zone.capacity);
    
    res.json({
      success: true,
      message: 'Parking occupancy updated',
      data: zone,
      available: zone.capacity - zone.occupied
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating parking zone',
      error: error.message
    });
  }
});

// Get route statistics
router.get('/stats/overview', (req, res) => {
  try {
    const { location } = req.query;
    
    let filteredRoutes = location 
      ? routes.filter(r => r.location === location)
      : routes;
    
    const stats = {
      totalRoutes: filteredRoutes.length,
      openRoutes: filteredRoutes.filter(r => r.status === 'open').length,
      closedRoutes: filteredRoutes.filter(r => r.status === 'closed').length,
      restrictedRoutes: filteredRoutes.filter(r => r.status === 'restricted').length,
      byType: {
        snani: filteredRoutes.filter(r => r.type === routeTypes.SNANI).length,
        vip: filteredRoutes.filter(r => r.type === routeTypes.VIP).length,
        emergency: filteredRoutes.filter(r => r.type === routeTypes.EMERGENCY).length,
        administrative: filteredRoutes.filter(r => r.type === routeTypes.ADMINISTRATIVE).length,
        black: filteredRoutes.filter(r => r.type === routeTypes.BLACK).length,
        general: filteredRoutes.filter(r => r.type === routeTypes.GENERAL).length
      },
      crowdDistribution: {
        low: filteredRoutes.filter(r => r.crowdLevel === 'low').length,
        medium: filteredRoutes.filter(r => r.crowdLevel === 'medium').length,
        high: filteredRoutes.filter(r => r.crowdLevel === 'high').length
      },
      totalCapacity: filteredRoutes.reduce((sum, r) => sum + r.capacity, 0),
      currentLoad: filteredRoutes.reduce((sum, r) => sum + r.currentLoad, 0)
    };
    
    res.json({
      success: true,
      data: stats,
      location: location || 'all',
      parvaniDay: routeStatuses.parvaniDay
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching route statistics',
      error: error.message
    });
  }
});

module.exports = router;