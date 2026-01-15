import React, { useState, useEffect, useRef } from 'react';
import { Map, NavigationControl, GeolocateControl, ScaleControl } from 'react-map-gl/maplibre';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FaBuilding, FaHospital, FaStore, FaUtensils,
  FaInfoCircle, FaSearch, FaFilter, FaCube, FaLanguage, FaBullhorn,
  FaParking, FaShieldAlt, FaWater
} from 'react-icons/fa';
import 'maplibre-gl/dist/maplibre-gl.css';

const Maps3DNew = () => {
  const { i18n } = useTranslation();
  const mapRef = useRef();
  const [selectedLocation, setSelectedLocation] = useState('nashik');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewState, setViewState] = useState({
    longitude: 73.7898,
    latitude: 19.9975,
    zoom: 14,
    pitch: 60,
    bearing: 0
  });
  const [buildings, setBuildings] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [events, setEvents] = useState([]);
  const [promotions, setPromotions] = useState([]);

  const kumbhLocations = {
    prayagraj: { 
      name: 'Prayagraj (Allahabad)', 
      coords: { longitude: 81.8463, latitude: 25.4358 }
    },
    haridwar: { 
      name: 'Haridwar', 
      coords: { longitude: 78.1642, latitude: 29.9457 }
    },
    nashik: { 
      name: 'Nashik - Premium 3D City 🏙️', 
      coords: { longitude: 73.7898, latitude: 19.9975 }
    },
    ujjain: { 
      name: 'Ujjain', 
      coords: { longitude: 75.7885, latitude: 23.1765 }
    }
  };

  // Generate 100+ buildings for Nashik with varied types
  const generateNashikBuildings = () => {
    const buildings = [];
    const baseCoords = { lat: 19.9975, lng: 73.7898 };
    
    // Building types with colors and icons
    const buildingTypes = [
      { type: 'temple', color: '#FF6B6B', icon: '🕉️', name: 'Temple' },
      { type: 'hospital', color: '#4ECDC4', icon: '🏥', name: 'Medical Center' },
      { type: 'food', color: '#FFD93D', icon: '🍽️', name: 'Food Court' },
      { type: 'admin', color: '#6BCB77', icon: '🏛️', name: 'Admin Building' },
      { type: 'accommodation', color: '#FF6B9D', icon: '🏨', name: 'Guest House' },
      { type: 'shopping', color: '#95E1D3', icon: '🛍️', name: 'Shopping Complex' },
      { type: 'parking', color: '#A8E6CF', icon: '🅿️', name: 'Parking Structure' },
      { type: 'security', color: '#FFD3B6', icon: '🛡️', name: 'Security Post' },
      { type: 'info', color: '#FFAAA5', icon: 'ℹ️', name: 'Information Center' },
      { type: 'toilet', color: '#FF8B94', icon: '🚻', name: 'Toilet Complex' }
    ];

    let id = 1;
    
    // Create a grid of buildings
    for (let i = 0; i < 12; i++) {
      for (let j = 0; j < 10; j++) {
        const typeIndex = Math.floor(Math.random() * buildingTypes.length);
        const buildingType = buildingTypes[typeIndex];
        
        buildings.push({
          id: id++,
          name: `${buildingType.name} ${id}`,
          type: buildingType.type,
          lat: baseCoords.lat + (i * 0.003) - 0.018,
          lng: baseCoords.lng + (j * 0.003) - 0.015,
          height: Math.floor(Math.random() * 30) + 15,
          floors: Math.floor(Math.random() * 5) + 2,
          color: buildingType.color,
          icon: buildingType.icon,
          capacity: Math.floor(Math.random() * 500) + 100,
          status: Math.random() > 0.3 ? 'operational' : 'maintenance'
        });
      }
    }

    return buildings;
  };

  // Building data for other locations
  const buildingData = {
    prayagraj: [
      { id: 1, name: 'Ram Ghat Temple', type: 'temple', lat: 25.4358, lng: 81.8463, height: 25, floors: 3, color: '#FF6B6B', icon: '🕉️', capacity: 500, status: 'operational' },
      { id: 2, name: 'Main Medical Center', type: 'hospital', lat: 25.4388, lng: 81.8493, height: 30, floors: 4, color: '#4ECDC4', icon: '🏥', capacity: 300, status: 'operational' },
      { id: 3, name: 'Food Plaza 1', type: 'food', lat: 25.4328, lng: 81.8433, height: 15, floors: 2, color: '#FFD93D', icon: '🍽️', capacity: 800, status: 'operational' },
      { id: 4, name: 'Admin Building A', type: 'admin', lat: 25.4418, lng: 81.8523, height: 28, floors: 4, color: '#6BCB77', icon: '🏛️', capacity: 200, status: 'operational' },
      { id: 5, name: 'Guest House Complex', type: 'accommodation', lat: 25.4298, lng: 81.8403, height: 20, floors: 5, color: '#FF6B9D', icon: '🏨', capacity: 400, status: 'operational' }
    ],

    haridwar: [
      { id: 9, name: 'Har Ki Pauri Temple', type: 'temple', lat: 29.9457, lng: 78.1642, height: 26, floors: 3, color: '#FF6B6B', icon: '🕉️', capacity: 550, status: 'operational' },
      { id: 10, name: 'Ganga Medical Center', type: 'hospital', lat: 29.9507, lng: 78.1592, height: 29, floors: 3, color: '#4ECDC4', icon: '🏥', capacity: 320, status: 'operational' }
    ],
    ujjain: [
      { id: 11, name: 'Mahakaleshwar Temple', type: 'temple', lat: 23.1765, lng: 75.7885, height: 27, floors: 3, color: '#FF6B6B', icon: '🕉️', capacity: 580, status: 'operational' },
      { id: 12, name: 'Shipra Medical Hub', type: 'hospital', lat: 23.1815, lng: 75.7835, height: 31, floors: 4, color: '#4ECDC4', icon: '🏥', capacity: 340, status: 'operational' }
    ],
    nashik: generateNashikBuildings()
  };

  // Events data
  const eventsData = [
    { id: 1, title: 'Shahi Snan - Royal Bath', date: '2026-01-14', location: 'prayagraj', description: 'Main bathing ceremony', time: '04:00 AM' },
    { id: 2, title: 'Cultural Program', date: '2026-01-15', location: 'nashik', description: 'Evening cultural performances', time: '06:00 PM' },
    { id: 3, title: 'Medical Camp', date: '2026-01-16', location: 'nashik', description: 'Free health checkup', time: '10:00 AM' },
    { id: 4, title: 'Nashik Grand Festival', date: '2026-01-17', location: 'nashik', description: 'City-wide Kumbh celebration', time: '10:00 AM' }
  ];

  // Promotions data
  const promotionsData = [
    { id: 1, title: 'Free Food Distribution', location: 'nashik', description: 'Langar service at all food courts', active: true },
    { id: 2, title: 'Guided Tours Available', location: 'all', description: 'Join guided spiritual tours', active: true },
    { id: 3, title: '3D Virtual Tours', location: 'nashik', description: 'Experience Nashik in stunning 3D', active: true }
  ];

  useEffect(() => {
    setBuildings(buildingData[selectedLocation] || []);
    setEvents(eventsData);
    setPromotions(promotionsData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  useEffect(() => {
    const location = kumbhLocations[selectedLocation];
    if (location) {
      setViewState(prev => ({
        ...prev,
        ...location.coords,
        zoom: selectedLocation === 'nashik' ? 14 : 15,
        pitch: 60,
        bearing: 0
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocation]);

  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || building.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(buildings.map(b => b.type))];

  const getCategoryIcon = (type) => {
    const icons = {
      temple: <FaCube className="text-red-500" />,
      hospital: <FaHospital className="text-blue-500" />,
      food: <FaUtensils className="text-yellow-500" />,
      admin: <FaBuilding className="text-green-500" />,
      accommodation: <FaBuilding className="text-pink-500" />,
      shopping: <FaStore className="text-purple-500" />,
      parking: <FaParking className="text-teal-500" />,
      security: <FaShieldAlt className="text-orange-500" />,
      info: <FaInfoCircle className="text-blue-400" />,
      toilet: <FaWater className="text-cyan-500" />
    };
    return icons[type] || <FaBuilding />;
  };

  // Initialize 3D buildings on map load
  const onMapLoad = () => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    // Wait for style to load
    map.on('style.load', () => {
      // Add 3D building layer
      if (!map.getLayer('3d-buildings')) {
        map.addLayer({
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 14,
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'height'],
              0, '#e0e0e0',
              50, '#b0b0b0',
              100, '#808080',
              200, '#505050'
            ],
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 0,
              16, ['get', 'height']
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14, 0,
              16, ['get', 'min_height']
            ],
            'fill-extrusion-opacity': 0.8
          }
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🗺️ 3D Interactive Maps - MapLibre GL
          </h1>
          <p className="text-xl text-gray-600">
            Real 3D buildings with tilt, rotation & smooth zoom - 100% Free!
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              ✔ 100% Free
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              ✔ No API Key
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              ✔ True 3D Buildings
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              ✔ Tilt & Rotate
            </span>
            <span className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm">
              {selectedLocation === 'nashik' ? '🏆 100+ Buildings' : '📍 Multiple Locations'}
            </span>
          </div>
        </motion.div>

        {/* Location Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {Object.entries(kumbhLocations).map(([key, loc]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedLocation(key);
                setSelectedBuilding(null);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedLocation === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search buildings, facilities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-3xl font-bold text-blue-600">{buildings.length}</div>
            <div className="text-sm text-gray-600">Buildings</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-3xl font-bold text-green-600">{filteredBuildings.length}</div>
            <div className="text-sm text-gray-600">Filtered</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-3xl font-bold text-purple-600">{events.length}</div>
            <div className="text-sm text-gray-600">Events</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-3xl font-bold text-orange-600">{promotions.length}</div>
            <div className="text-sm text-gray-600">Promotions</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Buildings List */}
          <div className="lg:col-span-1 space-y-4 max-h-[700px] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaBuilding />
              {selectedLocation === 'nashik' ? '100+ 3D Buildings' : 'Buildings'}
            </h3>
            
            {filteredBuildings.map(building => (
              <motion.div
                key={building.id}
                onClick={() => setSelectedBuilding(building)}
                className={`bg-white rounded-xl p-4 cursor-pointer transition shadow hover:shadow-lg ${
                  selectedBuilding?.id === building.id ? 'ring-2 ring-blue-500' : ''
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{building.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{building.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      {getCategoryIcon(building.type)}
                      <span className="capitalize">{building.type}</span>
                    </div>
                    <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-600">Height:</span>
                        <span className="font-semibold ml-1">{building.height}m</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Floors:</span>
                        <span className="font-semibold ml-1">{building.floors}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Capacity:</span>
                        <span className="font-semibold ml-1">{building.capacity}</span>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded text-xs ${
                          building.status === 'operational' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {building.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* 3D Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <FaCube className="text-purple-600" />
                  MapLibre 3D View
                </h3>
                <button
                  onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  <FaLanguage />
                  {i18n.language === 'en' ? 'हिंदी' : 'English'}
                </button>
              </div>

              <div className="rounded-xl overflow-hidden" style={{ height: '600px' }}>
                <Map
                  ref={mapRef}
                  {...viewState}
                  onMove={evt => setViewState(evt.viewState)}
                  onLoad={onMapLoad}
                  mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
                  style={{ width: '100%', height: '100%' }}
                  maxPitch={85}
                  minZoom={10}
                  maxZoom={20}
                >
                  <NavigationControl position="top-right" />
                  <GeolocateControl position="top-right" />
                  <ScaleControl />
                </Map>
              </div>

              {/* Map Controls Info */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <div className="font-semibold">🖱️ Drag</div>
                  <div className="text-xs text-gray-600">Pan map</div>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <div className="font-semibold">🔍 Scroll</div>
                  <div className="text-xs text-gray-600">Zoom in/out</div>
                </div>
                <div className="bg-purple-50 p-2 rounded text-center">
                  <div className="font-semibold">🎯 Ctrl+Drag</div>
                  <div className="text-xs text-gray-600">Tilt & Rotate</div>
                </div>
                <div className="bg-orange-50 p-2 rounded text-center">
                  <div className="font-semibold">📐 {Math.round(viewState.pitch)}°</div>
                  <div className="text-xs text-gray-600">Current tilt</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Building Details */}
        <AnimatePresence>
          {selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span className="text-4xl">{selectedBuilding.icon}</span>
                    {selectedBuilding.name}
                  </h3>
                  <p className="text-gray-600 capitalize">{selectedBuilding.type}</p>
                </div>
                <button
                  onClick={() => setSelectedBuilding(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="font-bold text-2xl text-blue-600">{selectedBuilding.height}m</div>
                  <div className="text-xs text-gray-600">Height</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="font-bold text-2xl text-green-600">{selectedBuilding.floors}</div>
                  <div className="text-xs text-gray-600">Floors</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="font-bold text-2xl text-purple-600">{selectedBuilding.capacity}</div>
                  <div className="text-xs text-gray-600">Capacity</div>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <div className={`font-bold text-2xl ${
                    selectedBuilding.status === 'operational' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {selectedBuilding.status === 'operational' ? '✓' : '⚠'}
                  </div>
                  <div className="text-xs text-gray-600 capitalize">{selectedBuilding.status}</div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <strong>📍 Location:</strong>
                <p className="text-sm text-gray-600 mt-1">
                  Latitude: {selectedBuilding.lat.toFixed(4)}, Longitude: {selectedBuilding.lng.toFixed(4)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events & Promotions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Events */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaBullhorn className="text-orange-600" />
              Active Events
            </h3>
            <div className="space-y-3">
              {events
                .filter(e => e.location === selectedLocation || e.location === 'all')
                .map(event => (
                  <div key={event.id} className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>📅 {event.date}</span>
                      <span>🕒 {event.time}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Promotions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-green-600" />
              Current Promotions
            </h3>
            <div className="space-y-3">
              {promotions
                .filter(p => p.location === selectedLocation || p.location === 'all')
                .filter(p => p.active)
                .map(promo => (
                  <div key={promo.id} className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                    <h4 className="font-semibold">{promo.title}</h4>
                    <p className="text-sm text-gray-600">{promo.description}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps3DNew;
