const express = require('express');
const router = express.Router();

// Medical facilities data
const medicalFacilities = [
  { id: 1, name: 'Main Medical Camp', type: 'hospital', lat: 25.4358, lng: 81.8463, 
    beds: 100, available: 45, doctors: 15, ambulances: 5, contact: '+91-9876543210' },
  { id: 2, name: 'Emergency Center Sector 1', type: 'emergency', lat: 25.4198, lng: 81.8343,
    beds: 50, available: 20, doctors: 8, ambulances: 3, contact: '+91-9876543211' },
  { id: 3, name: 'First Aid Station A', type: 'first-aid', lat: 25.4288, lng: 81.8403,
    beds: 20, available: 15, doctors: 4, ambulances: 1, contact: '+91-9876543212' },
  { id: 4, name: 'First Aid Station B', type: 'first-aid', lat: 25.4428, lng: 81.8523,
    beds: 20, available: 12, doctors: 4, ambulances: 1, contact: '+91-9876543213' },
  { id: 5, name: 'Mobile Medical Unit 1', type: 'mobile', lat: 25.4518, lng: 81.8583,
    beds: 10, available: 8, doctors: 2, ambulances: 2, contact: '+91-9876543214' },
  { id: 6, name: 'Trauma Center', type: 'trauma', lat: 25.4258, lng: 81.8583,
    beds: 75, available: 30, doctors: 12, ambulances: 4, contact: '+91-9876543215' },
  { id: 7, name: 'Pharmacy & Medicine Dispensary', type: 'pharmacy', lat: 25.4398, lng: 81.8343,
    beds: 0, available: 0, doctors: 2, ambulances: 0, contact: '+91-9876543216' },
  { id: 8, name: 'Ayurvedic Health Center', type: 'ayurvedic', lat: 25.4338, lng: 81.8403,
    beds: 30, available: 20, doctors: 5, ambulances: 0, contact: '+91-9876543217' }
];

// Emergency requests storage
let emergencyRequests = [];
let requestIdCounter = 1;

// Ambulance fleet
let ambulances = [
  { id: 'AMB-001', status: 'available', currentLat: 25.4358, currentLng: 81.8463, facility: 'Main Medical Camp', type: 'Advanced Life Support', equipment: ['Ventilator', 'Defibrillator', 'ECG'] },
  { id: 'AMB-002', status: 'available', currentLat: 25.4198, currentLng: 81.8343, facility: 'Emergency Center Sector 1', type: 'Basic Life Support', equipment: ['Oxygen', 'First Aid'] },
  { id: 'AMB-003', status: 'available', currentLat: 25.4428, currentLng: 81.8523, facility: 'First Aid Station B', type: 'Basic Life Support', equipment: ['Oxygen', 'First Aid'] },
  { id: 'AMB-004', status: 'available', currentLat: 25.4258, currentLng: 81.8583, facility: 'Trauma Center', type: 'Advanced Life Support', equipment: ['Ventilator', 'Defibrillator', 'ECG', 'Trauma Kit'] },
  { id: 'AMB-005', status: 'available', currentLat: 25.4518, currentLng: 81.8583, facility: 'Mobile Medical Unit 1', type: 'Basic Life Support', equipment: ['Oxygen', 'First Aid'] },
  // Private ambulances for Nashik
  { id: 'PVT-001', status: 'available', currentLat: 19.9975, currentLng: 73.7898, facility: 'Private Medical Services Nashik', type: 'Advanced Life Support', equipment: ['Ventilator', 'Defibrillator'], isPrivate: true },
  { id: 'PVT-002', status: 'available', currentLat: 19.9975, currentLng: 73.7898, facility: 'Private Ambulance Nashik', type: 'Basic Life Support', equipment: ['Oxygen'], isPrivate: true }
];

// Medicine Inventory
let medicineInventory = [
  { id: 1, name: 'Paracetamol', category: 'Pain Relief', stock: 5000, threshold: 1000, unit: 'tablets', location: 'Main Medical Camp', expiryDate: '2027-12-31' },
  { id: 2, name: 'Ibuprofen', category: 'Pain Relief', stock: 3500, threshold: 800, unit: 'tablets', location: 'Main Medical Camp', expiryDate: '2027-10-15' },
  { id: 3, name: 'ORS (Oral Rehydration Salts)', category: 'Hydration', stock: 8000, threshold: 2000, unit: 'packets', location: 'All Facilities', expiryDate: '2028-03-20' },
  { id: 4, name: 'Bandages', category: 'First Aid', stock: 2000, threshold: 500, unit: 'rolls', location: 'All Facilities', expiryDate: 'N/A' },
  { id: 5, name: 'Antiseptic Solution', category: 'First Aid', stock: 1500, threshold: 300, unit: 'bottles', location: 'All Facilities', expiryDate: '2027-08-30' },
  { id: 6, name: 'Antibiotics (Amoxicillin)', category: 'Antibiotics', stock: 2500, threshold: 500, unit: 'tablets', location: 'Main Medical Camp', expiryDate: '2027-11-25' },
  { id: 7, name: 'Anti-diarrheal', category: 'Gastro', stock: 4000, threshold: 1000, unit: 'tablets', location: 'All Facilities', expiryDate: '2028-01-10' },
  { id: 8, name: 'Insulin', category: 'Diabetes', stock: 500, threshold: 100, unit: 'vials', location: 'Main Medical Camp', expiryDate: '2026-06-15' },
  { id: 9, name: 'IV Fluids', category: 'Hydration', stock: 3000, threshold: 800, unit: 'bags', location: 'Hospital & Trauma', expiryDate: '2027-09-20' },
  { id: 10, name: 'Oxygen Cylinders', category: 'Emergency', stock: 150, threshold: 30, unit: 'cylinders', location: 'All Major Facilities', expiryDate: 'N/A' }
];

// First Aid Guides
const firstAidGuides = [
  {
    id: 1,
    title: 'Heat Stroke',
    severity: 'critical',
    symptoms: ['High body temperature', 'Confusion', 'Rapid pulse', 'Hot, dry skin'],
    steps: [
      'Move person to shade or cool area immediately',
      'Remove excess clothing',
      'Cool the person with water or wet cloth',
      'Fan the person',
      'Give cool water if conscious',
      'Call for medical help immediately'
    ],
    prevention: ['Stay hydrated', 'Avoid direct sun during peak hours', 'Wear light clothing']
  },
  {
    id: 2,
    title: 'Dehydration',
    severity: 'high',
    symptoms: ['Excessive thirst', 'Dry mouth', 'Fatigue', 'Dizziness', 'Dark urine'],
    steps: [
      'Move to shade',
      'Give ORS (Oral Rehydration Solution)',
      'Sip water slowly and continuously',
      'Rest completely',
      'Seek medical help if severe'
    ],
    prevention: ['Drink water regularly', 'Carry ORS packets', 'Avoid caffeine and alcohol']
  },
  {
    id: 3,
    title: 'Minor Cuts and Wounds',
    severity: 'low',
    symptoms: ['Bleeding', 'Pain', 'Visible wound'],
    steps: [
      'Wash hands before treating',
      'Clean wound with clean water',
      'Apply antiseptic',
      'Apply pressure if bleeding',
      'Cover with sterile bandage',
      'Change dressing daily'
    ],
    prevention: ['Wear proper footwear', 'Be careful in crowded areas', 'Keep first aid kit handy']
  },
  {
    id: 4,
    title: 'Crowd Crush / Stampede Injury',
    severity: 'critical',
    symptoms: ['Difficulty breathing', 'Chest pain', 'Bruising', 'Unconsciousness'],
    steps: [
      'Call emergency services immediately',
      'Move person to safe, open area if possible',
      'Check breathing and pulse',
      'Perform CPR if trained and necessary',
      'Do not move if spinal injury suspected',
      'Keep person calm and still'
    ],
    prevention: ['Avoid crowded areas', 'Stay near exits', 'Follow crowd management instructions']
  },
  {
    id: 5,
    title: 'Food Poisoning',
    severity: 'medium',
    symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Stomach cramps', 'Fever'],
    steps: [
      'Keep person hydrated with ORS',
      'Rest completely',
      'Avoid solid food initially',
      'Take anti-diarrheal medicine if available',
      'Seek medical help if symptoms persist',
      'Monitor for dehydration signs'
    ],
    prevention: ['Eat from clean, hygienic sources', 'Drink bottled or boiled water', 'Avoid street food']
  }
];

// Bed Availability Tracking (real-time)
let bedAvailability = {
  totalBeds: 305,
  occupied: 160,
  available: 145,
  reserved: 50,
  icuBeds: { total: 30, available: 12 },
  emergencyBeds: { total: 50, available: 28 },
  generalBeds: { total: 225, available: 105 },
  lastUpdated: new Date().toISOString()
};

// Request emergency medical assistance
router.post('/emergency', (req, res) => {
  try {
    const {
      patientName,
      age,
      gender,
      condition,
      severity, // critical, high, medium, low
      location,
      lat,
      lng,
      symptoms,
      contactNumber,
      reportedBy
    } = req.body;

    if (!location || !contactNumber || !condition) {
      return res.status(400).json({
        success: false,
        message: 'Location, contact number, and condition are required'
      });
    }

    const emergency = {
      id: requestIdCounter++,
      patientName: patientName || 'Unknown',
      age: age || 'Unknown',
      gender: gender || 'Unknown',
      condition,
      severity: severity || 'medium',
      location,
      lat: lat || null,
      lng: lng || null,
      symptoms: symptoms || '',
      contactNumber,
      reportedBy: reportedBy || 'Self',
      requestTime: new Date().toISOString(),
      status: 'pending', // pending, dispatched, in-transit, reached, completed
      assignedAmbulance: null,
      estimatedArrival: null,
      responseTime: null
    };

    // Find nearest available ambulance
    const nearestAmbulance = findNearestAmbulance(lat, lng);
    
    if (nearestAmbulance) {
      nearestAmbulance.status = 'dispatched';
      emergency.assignedAmbulance = nearestAmbulance.id;
      emergency.status = 'dispatched';
      emergency.estimatedArrival = calculateETA(nearestAmbulance, lat, lng);
      emergency.responseTime = new Date().toISOString();
    }

    emergencyRequests.push(emergency);

    // Find nearest medical facility
    const nearestFacility = findNearestFacility(lat, lng, severity);

    res.json({
      success: true,
      message: 'Emergency request registered successfully',
      data: {
        request: emergency,
        ambulance: nearestAmbulance || null,
        nearestFacility: nearestFacility || null,
        helpline: '108' // Emergency helpline number
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error processing emergency request',
      error: error.message
    });
  }
});

// Get all medical facilities
router.get('/facilities', (req, res) => {
  try {
    const { type, hasAvailableBeds } = req.query;
    
    let filtered = [...medicalFacilities];

    if (type) {
      filtered = filtered.filter(f => f.type === type);
    }
    
    if (hasAvailableBeds === 'true') {
      filtered = filtered.filter(f => f.available > 0);
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medical facilities',
      error: error.message
    });
  }
});

// Get nearest medical facility
router.post('/facilities/nearest', (req, res) => {
  try {
    const { lat, lng, type, severity } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const nearest = findNearestFacility(lat, lng, severity, type);

    if (!nearest) {
      return res.status(404).json({
        success: false,
        message: 'No medical facilities found nearby'
      });
    }

    res.json({
      success: true,
      data: nearest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error finding nearest facility',
      error: error.message
    });
  }
});

// Get all emergency requests
router.get('/emergencies', (req, res) => {
  try {
    const { status, severity } = req.query;
    
    let filtered = [...emergencyRequests];

    if (status) {
      filtered = filtered.filter(e => e.status === status);
    }
    
    if (severity) {
      filtered = filtered.filter(e => e.severity === severity);
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered.sort((a, b) => new Date(b.requestTime) - new Date(a.requestTime))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency requests',
      error: error.message
    });
  }
});

// Get specific emergency request
router.get('/emergencies/:id', (req, res) => {
  try {
    const { id } = req.params;
    const emergency = emergencyRequests.find(e => e.id === parseInt(id));

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }

    res.json({
      success: true,
      data: emergency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching emergency request',
      error: error.message
    });
  }
});

// Update emergency status
router.put('/emergencies/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const emergency = emergencyRequests.find(e => e.id === parseInt(id));

    if (!emergency) {
      return res.status(404).json({
        success: false,
        message: 'Emergency request not found'
      });
    }

    emergency.status = status;
    emergency.lastUpdated = new Date().toISOString();
    
    if (notes) {
      emergency.notes = notes;
    }

    if (status === 'completed' && emergency.assignedAmbulance) {
      const ambulance = ambulances.find(a => a.id === emergency.assignedAmbulance);
      if (ambulance) {
        ambulance.status = 'available';
      }
    }

    res.json({
      success: true,
      message: 'Emergency status updated',
      data: emergency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating emergency status',
      error: error.message
    });
  }
});

// Get ambulance status
router.get('/ambulances', (req, res) => {
  try {
    const { status } = req.query;
    
    let filtered = [...ambulances];

    if (status) {
      filtered = filtered.filter(a => a.status === status);
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ambulance data',
      error: error.message
    });
  }
});

// Get medical statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      totalFacilities: medicalFacilities.length,
      totalBeds: medicalFacilities.reduce((sum, f) => sum + f.beds, 0),
      availableBeds: medicalFacilities.reduce((sum, f) => sum + f.available, 0),
      totalDoctors: medicalFacilities.reduce((sum, f) => sum + f.doctors, 0),
      totalAmbulances: ambulances.length,
      availableAmbulances: ambulances.filter(a => a.status === 'available').length,
      activeEmergencies: emergencyRequests.filter(e => 
        ['pending', 'dispatched', 'in-transit', 'reached'].includes(e.status)
      ).length,
      totalEmergencies: emergencyRequests.length,
      criticalCases: emergencyRequests.filter(e => 
        e.severity === 'critical' && e.status !== 'completed'
      ).length,
      averageResponseTime: calculateAverageResponseTime(),
      recentEmergencies: emergencyRequests.slice(-10).reverse()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medical statistics',
      error: error.message
    });
  }
});

// Get health advisories
router.get('/advisories', (req, res) => {
  try {
    const advisories = [
      {
        id: 1,
        title: 'Heatstroke Prevention',
        severity: 'high',
        message: 'Stay hydrated and avoid direct sunlight during peak hours (12 PM - 3 PM)',
        category: 'heat',
        timestamp: new Date().toISOString()
      },
      {
        id: 2,
        title: 'COVID-19 Precautions',
        severity: 'medium',
        message: 'Wear masks in crowded areas and maintain social distancing',
        category: 'pandemic',
        timestamp: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Food Safety',
        severity: 'medium',
        message: 'Consume food only from authorized vendors. Avoid stale or uncovered food',
        category: 'hygiene',
        timestamp: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Emergency Numbers',
        severity: 'info',
        message: 'Medical Emergency: 108 | Police: 100 | Fire: 101',
        category: 'information',
        timestamp: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      count: advisories.length,
      data: advisories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching health advisories',
      error: error.message
    });
  }
});

// Helper functions
function findNearestAmbulance(lat, lng) {
  const available = ambulances.filter(a => a.status === 'available');
  
  if (available.length === 0) return null;
  
  let nearest = available[0];
  let minDistance = calculateDistance(lat, lng, nearest.currentLat, nearest.currentLng);
  
  for (let i = 1; i < available.length; i++) {
    const distance = calculateDistance(lat, lng, available[i].currentLat, available[i].currentLng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = available[i];
    }
  }
  
  return nearest;
}

function findNearestFacility(lat, lng, severity, type = null) {
  let facilities = [...medicalFacilities];
  
  // Filter by type if specified
  if (type) {
    facilities = facilities.filter(f => f.type === type);
  }
  
  // For critical cases, prioritize hospitals and trauma centers
  if (severity === 'critical') {
    const critical = facilities.filter(f => f.type === 'hospital' || f.type === 'trauma' || f.type === 'emergency');
    if (critical.length > 0) {
      facilities = critical;
    }
  }
  
  // Filter facilities with available capacity
  facilities = facilities.filter(f => f.available > 0 || f.type === 'pharmacy' || f.type === 'first-aid');
  
  if (facilities.length === 0) return null;
  
  let nearest = facilities[0];
  let minDistance = calculateDistance(lat, lng, nearest.lat, nearest.lng);
  
  for (let i = 1; i < facilities.length; i++) {
    const distance = calculateDistance(lat, lng, facilities[i].lat, facilities[i].lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = facilities[i];
    }
  }
  
  return { ...nearest, distance: minDistance.toFixed(2) };
}

function calculateDistance(lat1, lng1, lat2, lng2) {
  // Haversine formula for distance calculation
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function calculateETA(ambulance, targetLat, targetLng) {
  const distance = calculateDistance(ambulance.currentLat, ambulance.currentLng, targetLat, targetLng);
  const avgSpeed = 30; // km/h in crowded conditions
  const minutes = Math.ceil((distance / avgSpeed) * 60);
  return `${minutes} minutes`;
}

function calculateAverageResponseTime() {
  const completed = emergencyRequests.filter(e => e.responseTime);
  if (completed.length === 0) return 'N/A';
  
  const totalMinutes = completed.reduce((sum, e) => {
    const requested = new Date(e.requestTime);
    const responded = new Date(e.responseTime);
    return sum + ((responded - requested) / 1000 / 60);
  }, 0);
  
  return `${Math.round(totalMinutes / completed.length)} minutes`;
}

// MEDI-TRACKER ENDPOINTS

// Get bed availability
router.get('/bed-availability', (req, res) => {
  try {
    // Simulate real-time updates
    bedAvailability.lastUpdated = new Date().toISOString();
    
    res.json({
      success: true,
      data: bedAvailability,
      facilitiesBreakdown: medicalFacilities.map(f => ({
        name: f.name,
        totalBeds: f.beds,
        available: f.available,
        occupancy: f.beds > 0 ? Math.round(((f.beds - f.available) / f.beds) * 100) : 0
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bed availability',
      error: error.message
    });
  }
});

// Get medicine inventory
router.get('/medicine-inventory', (req, res) => {
  try {
    const { category, lowStock } = req.query;
    
    let inventory = [...medicineInventory];
    
    if (category) {
      inventory = inventory.filter(m => m.category.toLowerCase() === category.toLowerCase());
    }
    
    if (lowStock === 'true') {
      inventory = inventory.filter(m => m.stock <= m.threshold);
    }
    
    const categories = [...new Set(medicineInventory.map(m => m.category))];
    const lowStockItems = medicineInventory.filter(m => m.stock <= m.threshold).length;
    
    res.json({
      success: true,
      count: inventory.length,
      data: inventory,
      summary: {
        totalItems: medicineInventory.length,
        categories: categories,
        lowStockAlerts: lowStockItems
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching medicine inventory',
      error: error.message
    });
  }
});

// Update medicine stock
router.patch('/medicine-inventory/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { stock, action } = req.body; // action: 'add' or 'consume'
    
    const medicine = medicineInventory.find(m => m.id === parseInt(id));
    
    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found'
      });
    }
    
    if (action === 'add') {
      medicine.stock += stock;
    } else if (action === 'consume') {
      medicine.stock = Math.max(0, medicine.stock - stock);
    } else {
      medicine.stock = stock;
    }
    
    res.json({
      success: true,
      message: 'Medicine stock updated',
      data: medicine,
      alert: medicine.stock <= medicine.threshold ? 'Low stock alert!' : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating medicine stock',
      error: error.message
    });
  }
});

// Get first aid guides
router.get('/first-aid-guides', (req, res) => {
  try {
    const { severity } = req.query;
    
    let guides = [...firstAidGuides];
    
    if (severity) {
      guides = guides.filter(g => g.severity === severity);
    }
    
    res.json({
      success: true,
      count: guides.length,
      data: guides
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching first aid guides',
      error: error.message
    });
  }
});

// Get specific first aid guide
router.get('/first-aid-guides/:id', (req, res) => {
  try {
    const { id } = req.params;
    const guide = firstAidGuides.find(g => g.id === parseInt(id));
    
    if (!guide) {
      return res.status(404).json({
        success: false,
        message: 'First aid guide not found'
      });
    }
    
    res.json({
      success: true,
      data: guide
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching first aid guide',
      error: error.message
    });
  }
});

// Get all ambulances with real-time tracking
router.get('/ambulances', (req, res) => {
  try {
    const { status, type, isPrivate } = req.query;
    
    let ambulanceList = [...ambulances];
    
    if (status) {
      ambulanceList = ambulanceList.filter(a => a.status === status);
    }
    
    if (type) {
      ambulanceList = ambulanceList.filter(a => a.type === type);
    }
    
    if (isPrivate !== undefined) {
      ambulanceList = ambulanceList.filter(a => a.isPrivate === (isPrivate === 'true'));
    }
    
    const stats = {
      total: ambulances.length,
      available: ambulances.filter(a => a.status === 'available').length,
      dispatched: ambulances.filter(a => a.status === 'dispatched').length,
      government: ambulances.filter(a => !a.isPrivate).length,
      private: ambulances.filter(a => a.isPrivate).length
    };
    
    res.json({
      success: true,
      count: ambulanceList.length,
      data: ambulanceList,
      stats: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching ambulances',
      error: error.message
    });
  }
});

module.exports = router;
