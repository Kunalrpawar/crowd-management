import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import { 
  FaMapMarkedAlt, FaBuilding, FaHospital, FaStore, FaUtensils,
  FaToilet, FaWater, FaShieldAlt, FaParking, FaInfoCircle,
  FaSearch, FaFilter, FaCube, FaExpand, FaLanguage, FaBullhorn
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

// Custom 3D Building Component
const Building3D = ({ building, isSelected, onClick }) => {
  const heightScale = 3; // Increase visual height
  const height = building.height * heightScale;
  
  return (
    <div
      onClick={onClick}
      className={`building-3d ${isSelected ? 'selected' : ''}`}
      style={{
        position: 'relative',
        width: `${building.width}px`,
        height: `${building.length}px`,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transformStyle: 'preserve-3d',
        transform: isSelected ? 'scale(1.1) rotateX(55deg) rotateZ(-45deg)' : 'rotateX(55deg) rotateZ(-45deg)',
      }}
    >
      {/* Base of building */}
      <div
        className="building-base"
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: building.color,
          borderRadius: '4px',
          boxShadow: isSelected ? '0 20px 40px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.3)',
          position: 'relative',
          border: '2px solid rgba(255,255,255,0.3)',
        }}
      >
        {/* Building Icon */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotateZ(45deg) rotateX(-55deg)',
            fontSize: '24px',
            zIndex: 10,
          }}
        >
          {building.icon}
        </div>
      </div>

      {/* 3D Extruded sides */}
      {[...Array(building.floors)].map((_, idx) => (
        <div
          key={idx}
          className="building-floor"
          style={{
            position: 'absolute',
            bottom: `${(idx + 1) * (height / building.floors)}px`,
            left: 0,
            width: '100%',
            height: `${height / building.floors}px`,
            backgroundColor: building.color,
            opacity: 0.9 - (idx * 0.1),
            border: '1px solid rgba(255,255,255,0.2)',
            transformOrigin: 'bottom',
            transform: 'translateZ(-1px)',
            boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.2)',
          }}
        >
          {/* Floor windows */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, 8px)',
            gap: '4px',
            padding: '4px',
            height: '100%',
          }}>
            {[...Array(Math.floor(building.width / 12))].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: 'rgba(255, 255, 200, 0.6)',
                  borderRadius: '1px',
                }}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Building shadow */}
      <div
        className="building-shadow"
        style={{
          position: 'absolute',
          bottom: `-${height}px`,
          left: '50%',
          width: '120%',
          height: '120%',
          backgroundColor: 'rgba(0,0,0,0.3)',
          filter: 'blur(15px)',
          borderRadius: '50%',
          transform: 'translateX(-50%) translateZ(-100px)',
          zIndex: -1,
        }}
      />

      {/* Building name tag */}
      <div
        style={{
          position: 'absolute',
          top: `-${height + 30}px`,
          left: '50%',
          transform: 'translateX(-50%) rotateZ(45deg) rotateX(-55deg)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '10px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          border: '1px solid rgba(0,0,0,0.1)',
          zIndex: 20,
        }}
      >
        {building.name}
        <div style={{ fontSize: '8px', color: '#666' }}>{building.height}m | {building.floors} floors</div>
      </div>
    </div>
  );
};

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const Maps3D = () => {
  const { t, i18n } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState('prayagraj');
  const [buildings, setBuildings] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [viewMode, setViewMode] = useState('2d'); // 2d or 3d
  const [events, setEvents] = useState([]);
  const [promotions, setPromotion] = useState([]);

  const kumbhLocations = {
    prayagraj: { 
      name: 'Prayagraj (Allahabad)', 
      coords: [25.4358, 81.8463],
      zoom: 14
    },
    haridwar: { 
      name: 'Haridwar', 
      coords: [29.9457, 78.1642],
      zoom: 14
    },
    nashik: { 
      name: 'Nashik', 
      coords: [19.9975, 73.7898],
      zoom: 14
    },
    ujjain: { 
      name: 'Ujjain', 
      coords: [23.1765, 75.7885],
      zoom: 14
    }
  };

  // Mock 3D building data with coordinates and dimensions
  const buildingData = {
    prayagraj: [
      { id: 1, name: 'Main Medical Center', type: 'hospital', lat: 25.4358, lng: 81.8463, height: 25, width: 80, length: 60, floors: 3, color: '#FF6B6B', icon: '🏥' },
      { id: 2, name: 'Administrative Building', type: 'admin', lat: 25.4388, lng: 81.8493, height: 30, width: 100, length: 80, floors: 4, color: '#4ECDC4', icon: '🏛️' },
      { id: 3, name: 'Food Court Complex', type: 'food', lat: 25.4328, lng: 81.8433, height: 15, width: 120, length: 100, floors: 2, color: '#FFD93D', icon: '🍽️' },
      { id: 4, name: 'Security Headquarters', type: 'security', lat: 25.4418, lng: 81.8523, height: 20, width: 70, length: 50, floors: 2, color: '#6BCB77', icon: '🛡️' },
      { id: 5, name: 'Shopping Complex', type: 'shopping', lat: 25.4298, lng: 81.8403, height: 20, width: 150, length: 120, floors: 3, color: '#FF6B9D', icon: '🛍️' },
      { id: 6, name: 'Parking Structure', type: 'parking', lat: 25.4458, lng: 81.8563, height: 18, width: 200, length: 150, floors: 3, color: '#95E1D3', icon: '🅿️' },
      { id: 7, name: 'Information Center', type: 'info', lat: 25.4268, lng: 81.8373, height: 12, width: 60, length: 50, floors: 1, color: '#A8E6CF', icon: 'ℹ️' },
      { id: 8, name: 'Temporary Shelter', type: 'shelter', lat: 25.4238, lng: 81.8343, height: 10, width: 100, length: 80, floors: 1, color: '#FFDAC1', icon: '🏠' }
    ],
    nashik: [
      { id: 9, name: 'Nashik Medical Hub', type: 'hospital', lat: 19.9975, lng: 73.7898, height: 28, width: 90, length: 70, floors: 3, color: '#FF6B6B', icon: '🏥' },
      { id: 10, name: 'Ramkund Information', type: 'info', lat: 20.0025, lng: 73.7848, height: 12, width: 50, length: 40, floors: 1, color: '#A8E6CF', icon: 'ℹ️' },
      { id: 11, name: 'Godavari Food Plaza', type: 'food', lat: 19.9925, lng: 73.7948, height: 16, width: 110, length: 90, floors: 2, color: '#FFD93D', icon: '🍽️' }
    ],
    haridwar: [
      { id: 12, name: 'Har Ki Pauri Medical', type: 'hospital', lat: 29.9457, lng: 78.1642, height: 22, width: 75, length: 60, floors: 2, color: '#FF6B6B', icon: '🏥' },
      { id: 13, name: 'Ganga Seva Center', type: 'admin', lat: 29.9507, lng: 78.1592, height: 25, width: 85, length: 70, floors: 3, color: '#4ECDC4', icon: '🏛️' }
    ],
    ujjain: [
      { id: 14, name: 'Mahakal Medical Center', type: 'hospital', lat: 23.1765, lng: 75.7885, height: 24, width: 80, length: 65, floors: 3, color: '#FF6B6B', icon: '🏥' },
      { id: 15, name: 'Shipra Information Hub', type: 'info', lat: 23.1815, lng: 75.7835, height: 14, width: 55, length: 45, floors: 1, color: '#A8E6CF', icon: 'ℹ️' }
    ]
  };

  // Facilities and Points of Interest
  const facilitiesData = {
    prayagraj: [
      { id: 1, name: 'Water Station 1', type: 'water', lat: 25.4348, lng: 81.8453, icon: '💧', services: ['Drinking Water', 'Washrooms'] },
      { id: 2, name: 'Toilet Complex A', type: 'toilet', lat: 25.4308, lng: 81.8413, icon: '🚻', services: ['Clean Toilets', 'Hand Wash'] },
      { id: 3, name: 'First Aid Station', type: 'medical', lat: 25.4378, lng: 81.8473, icon: '⚕️', services: ['First Aid', 'Emergency Care'] },
      { id: 4, name: 'Lost & Found Center', type: 'service', lat: 25.4338, lng: 81.8443, icon: '🔍', services: ['Lost Items', 'Missing Persons'] },
      { id: 5, name: 'Police Post', type: 'security', lat: 25.4368, lng: 81.8483, icon: '👮', services: ['Security', 'Emergency Help'] }
    ],
    nashik: [
      { id: 6, name: 'Nashik Water Point', type: 'water', lat: 20.0000, lng: 73.7873, icon: '💧', services: ['Drinking Water'] },
      { id: 7, name: 'Security Booth', type: 'security', lat: 20.0050, lng: 73.7823, icon: '👮', services: ['Security'] }
    ],
    haridwar: [
      { id: 8, name: 'Ganga Water Facility', type: 'water', lat: 29.9482, lng: 78.1617, icon: '💧', services: ['Holy Water', 'Drinking Water'] }
    ],
    ujjain: [
      { id: 9, name: 'Shipra Facility', type: 'water', lat: 23.1790, lng: 75.7860, icon: '💧', services: ['Water Supply'] }
    ]
  };

  // Active Events
  const eventsData = [
    { id: 1, title: 'Shahi Snan - Royal Bath', date: '2026-01-14', location: 'prayagraj', description: 'Main bathing ceremony', time: '04:00 AM' },
    { id: 2, title: 'Cultural Program', date: '2026-01-15', location: 'prayagraj', description: 'Evening cultural performances', time: '06:00 PM' },
    { id: 3, title: 'Medical Camp', date: '2026-01-16', location: 'nashik', description: 'Free health checkup', time: '10:00 AM' }
  ];

  // Promotions
  const promotionsData = [
    { id: 1, title: 'Free Food Distribution', location: 'prayagraj', description: 'Langar service at Food Court', active: true },
    { id: 2, title: 'Guided Tours Available', location: 'all', description: 'Join guided spiritual tours', active: true },
    { id: 3, title: 'Discount on Souvenirs', location: 'nashik', description: '20% off at shopping complex', active: true }
  ];

  useEffect(() => {
    setBuildings(buildingData[selectedLocation] || []);
    setFacilities(facilitiesData[selectedLocation] || []);
    setEvents(eventsData);
    setPromotion(promotionsData);
  }, [selectedLocation]);

  const center = kumbhLocations[selectedLocation].coords;
  const zoom = kumbhLocations[selectedLocation].zoom;

  const getCategoryIcon = (type) => {
    switch (type) {
      case 'hospital': return <FaHospital />;
      case 'food': return <FaUtensils />;
      case 'parking': return <FaParking />;
      case 'security': return <FaShieldAlt />;
      case 'shopping': return <FaStore />;
      case 'water': return <FaWater />;
      case 'toilet': return <FaToilet />;
      default: return <FaBuilding />;
    }
  };

  const filteredBuildings = buildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || building.type === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(buildings.map(b => b.type))];

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
            🗺️ 3D Interactive Maps
          </h1>
          <p className="text-xl text-gray-600">
            Customizable digital maps for navigation and event management
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              📱 Smartphone Friendly
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              🔄 Real-time Updates
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              🌐 Multi-language
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              🎯 Location Markers
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
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

          {/* View Mode Toggle */}
        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setViewMode('2d')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${
              viewMode === '2d'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaMapMarkedAlt />
            2D Map View
          </button>
          <button
            onClick={() => setViewMode('3d')}
            className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 ${
              viewMode === '3d'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FaCube />
            3D Building View
          </button>
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
            <div className="text-3xl font-bold text-green-600">{facilities.length}</div>
            <div className="text-sm text-gray-600">Facilities</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow text-center">
            <div className="text-3xl font-bold text-purple-600">{events.length}</div>
            <div className="text-sm text-gray-600">Active Events</div>
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
              {viewMode === '3d' ? '3D Buildings' : 'Map Markers'}
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
                    {viewMode === '3d' && (
                      <div className="mt-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Height:</span>
                          <span className="font-semibold">{building.height}m</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Floors:</span>
                          <span className="font-semibold">{building.floors}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Size:</span>
                          <span className="font-semibold">{building.width}m × {building.length}m</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Facilities */}
            <h3 className="text-2xl font-bold mt-6 mb-4 flex items-center gap-2">
              <FaInfoCircle />
              Facilities & Services
            </h3>
            
            {facilities.map(facility => (
              <div key={facility.id} className="bg-white rounded-xl p-4 shadow">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{facility.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{facility.name}</h4>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {facility.services.map((service, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Map or 3D View */}
          <div className="lg:col-span-2 space-y-6">
            {viewMode === '2d' ? (
              /* 2D Map View */
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold">Interactive Map</h3>
                  <button
                    onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
                    className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                  >
                    <FaLanguage />
                    {i18n.language === 'en' ? 'हिंदी' : 'English'}
                  </button>
                </div>

                <MapContainer
                  key={`${selectedLocation}-2d`}
                  center={center}
                  zoom={zoom}
                  style={{ height: '600px', borderRadius: '12px' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />

                  {/* Building markers */}
                  {filteredBuildings.map(building => (
                    <Marker
                      key={building.id}
                      position={[building.lat, building.lng]}
                      eventHandlers={{
                        click: () => setSelectedBuilding(building)
                      }}
                    >
                      <Popup>
                        <div className="text-center">
                          <div className="text-2xl mb-2">{building.icon}</div>
                          <strong>{building.name}</strong><br />
                          <small className="capitalize">{building.type}</small>
                        </div>
                      </Popup>
                    </Marker>
                  ))}

                  {/* Facility markers */}
                  {facilities.map(facility => (
                    <Circle
                      key={facility.id}
                      center={[facility.lat, facility.lng]}
                      radius={50}
                      pathOptions={{
                        color: '#3B82F6',
                        fillColor: '#3B82F6',
                        fillOpacity: 0.4
                      }}
                    >
                      <Popup>
                        <div>
                          <div className="text-xl mb-1">{facility.icon}</div>
                          <strong>{facility.name}</strong><br />
                          <div className="text-xs mt-1">
                            {facility.services.map((s, i) => (
                              <div key={i}>• {s}</div>
                            ))}
                          </div>
                        </div>
                      </Popup>
                    </Circle>
                  ))}
                </MapContainer>

                {/* Legend */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  {Array.from(new Set(buildings.map(b => b.type))).map(type => (
                    <div key={type} className="flex items-center gap-2">
                      {getCategoryIcon(type)}
                      <span className="capitalize">{type}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* 3D Isometric View */
              <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FaCube className="text-purple-400" />
                    3D Building Visualization
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'hi' : 'en')}
                      className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
                    >
                      <FaLanguage />
                      {i18n.language === 'en' ? 'हिंदी' : 'English'}
                    </button>
                  </div>
                </div>

                {/* 3D City Scene */}
                <div 
                  className="relative bg-gradient-to-b from-sky-200 to-green-100 rounded-xl p-8"
                  style={{
                    minHeight: '600px',
                    perspective: '1500px',
                    perspectiveOrigin: '50% 30%',
                    overflow: 'visible'
                  }}
                >
                  {/* Ground plane */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)',
                      transform: 'rotateX(55deg) translateZ(-50px)',
                      transformStyle: 'preserve-3d',
                      borderRadius: '12px',
                    }}
                  />

                  {/* Grid lines for depth */}
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      backgroundImage: 'linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)',
                      backgroundSize: '50px 50px',
                      transform: 'rotateX(55deg) translateZ(-40px)',
                      borderRadius: '12px',
                    }}
                  />

                  {/* 3D Buildings Container */}
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '40px',
                      justifyContent: 'center',
                      alignItems: 'flex-end',
                      padding: '40px',
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(0)',
                    }}
                  >
                    {filteredBuildings.map(building => (
                      <Building3D
                        key={building.id}
                        building={building}
                        isSelected={selectedBuilding?.id === building.id}
                        onClick={() => setSelectedBuilding(building)}
                      />
                    ))}
                  </div>

                  {/* Lighting effect */}
                  <div
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, transparent 70%)',
                      mixBlendMode: 'overlay',
                    }}
                  />

                  {/* Instructions */}
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
                    💡 Click on any building to view details
                  </div>

                  {/* Sun/Light source indicator */}
                  <div className="absolute top-4 right-4 text-4xl animate-pulse">
                    ☀️
                  </div>
                </div>

                {/* 3D View Controls */}
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
                    🏗️ {filteredBuildings.length} Buildings Rendered
                  </div>
                  <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
                    📐 Isometric View (55° angle)
                  </div>
                  <div className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm">
                    ✨ Real-time 3D
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Building Details Panel */}
        <AnimatePresence>
          {selectedBuilding && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-2xl shadow-lg p-6"
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
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {viewMode === '3d' && (
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
                    <div className="font-bold text-2xl text-purple-600">{selectedBuilding.width}m</div>
                    <div className="text-xs text-gray-600">Width</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="font-bold text-2xl text-orange-600">{selectedBuilding.length}m</div>
                    <div className="text-xs text-gray-600">Length</div>
                  </div>
                </div>
              )}

              <div className="p-4 bg-gray-50 rounded-lg">
                <strong>📍 Location:</strong>
                <p className="text-sm text-gray-600 mt-1">
                  Latitude: {selectedBuilding.lat}, Longitude: {selectedBuilding.lng}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Events & Promotions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

export default Maps3D;