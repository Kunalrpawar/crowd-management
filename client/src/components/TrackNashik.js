import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import { 
  FaRoute, FaMapMarkedAlt, FaParking, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaInfoCircle, FaShieldAlt,
  FaCar, FaBus, FaMotorcycle, FaUserShield, FaAmbulance
} from 'react-icons/fa';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const TrackNashik = () => {
  const { t } = useTranslation();
  const [selectedLocation, setSelectedLocation] = useState('prayagraj');
  const [routes, setRoutes] = useState([]);
  const [parkingZones, setParkingZones] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [isParvaniDay, setIsParvaniDay] = useState(false);

  const kumbhLocations = {
    prayagraj: { name: 'Prayagraj (Allahabad)', coords: [25.4358, 81.8463] },
    haridwar: { name: 'Haridwar', coords: [29.9457, 78.1642] },
    nashik: { name: 'Nashik', coords: [19.9975, 73.7898] },
    ujjain: { name: 'Ujjain', coords: [23.1765, 75.7885] }
  };

  const center = kumbhLocations[selectedLocation].coords;

  useEffect(() => {
    fetchRouteData();
    const interval = setInterval(fetchRouteData, 15000);
    return () => clearInterval(interval);
  }, [selectedLocation, filterType]);

  const fetchRouteData = async () => {
    try {
      const [routesRes, parkingRes, statsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/track-nashik?location=${selectedLocation}${filterType !== 'all' ? `&type=${filterType}` : ''}`),
        fetch(`http://localhost:5000/api/track-nashik/parking/zones?location=${selectedLocation}`),
        fetch(`http://localhost:5000/api/track-nashik/stats/overview?location=${selectedLocation}`)
      ]);

      const routesData = await routesRes.json();
      const parkingData = await parkingRes.json();
      const statsData = await statsRes.json();

      if (routesData.success) {
        setRoutes(routesData.data);
        setIsParvaniDay(routesData.statusInfo.parvaniDay);
      }
      if (parkingData.success) setParkingZones(parkingData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Error fetching route data:', error);
    }
  };

  const getRouteColor = (type) => {
    switch (type) {
      case 'black': return '#000000';
      case 'vip': return '#FFD700';
      case 'emergency': return '#FF0000';
      case 'snani': return '#4169E1';
      case 'administrative': return '#8B4789';
      case 'general': return '#32CD32';
      default: return '#808080';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open': return <FaCheckCircle className="text-green-600" />;
      case 'closed': return <FaTimesCircle className="text-red-600" />;
      case 'restricted': return <FaExclamationTriangle className="text-yellow-600" />;
      default: return <FaInfoCircle className="text-gray-600" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'vip': return <FaUserShield />;
      case 'emergency': return <FaAmbulance />;
      case 'snani': return <FaRoute />;
      case 'administrative': return <FaShieldAlt />;
      default: return <FaMapMarkedAlt />;
    }
  };

  const getCrowdColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const toggleParvaniDay = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/track-nashik/parvani-toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !isParvaniDay })
      });

      const data = await response.json();
      if (data.success) {
        setIsParvaniDay(!isParvaniDay);
        fetchRouteData();
        alert(`Parvani Day ${!isParvaniDay ? 'Activated' : 'Deactivated'}`);
      }
    } catch (error) {
      console.error('Error toggling Parvani day:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-purple-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-purple-600 bg-clip-text text-transparent">
            🗺️ Track Nashik - Dynamic Route Management
          </h1>
          <p className="text-xl text-gray-600">
            Real-time route monitoring across all Kumbh Mela locations
          </p>
        </motion.div>

        {/* Location Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(kumbhLocations).map(([key, loc]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedLocation(key);
                setSelectedRoute(null);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedLocation === key
                  ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {loc.name}
            </button>
          ))}
        </div>

        {/* Parvani Day Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleParvaniDay}
            className={`px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-lg ${
              isParvaniDay
                ? 'bg-gradient-to-r from-red-600 to-red-700 animate-pulse'
                : 'bg-gradient-to-r from-gray-600 to-gray-700'
            }`}
          >
            {isParvaniDay ? '🔴 PARVANI DAY ACTIVE - Black Routes Closed' : '⚪ Normal Day - All Routes Open'}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-green-600">{stats.openRoutes || 0}</div>
            <div className="text-sm text-gray-600">Open Routes</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-red-600">{stats.closedRoutes || 0}</div>
            <div className="text-sm text-gray-600">Closed Routes</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-yellow-600">{stats.restrictedRoutes || 0}</div>
            <div className="text-sm text-gray-600">Restricted</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-blue-600">{stats.byType?.snani || 0}</div>
            <div className="text-sm text-gray-600">Snani Routes</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-purple-600">{stats.byType?.emergency || 0}</div>
            <div className="text-sm text-gray-600">Emergency</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow">
            <div className="text-2xl font-bold text-gray-600">{parkingZones.length}</div>
            <div className="text-sm text-gray-600">Parking Zones</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {[
            { value: 'all', label: 'All Routes', icon: <FaRoute /> },
            { value: 'snani', label: 'Bathing Routes', icon: <FaRoute /> },
            { value: 'vip', label: 'VIP', icon: <FaUserShield /> },
            { value: 'emergency', label: 'Emergency', icon: <FaAmbulance /> },
            { value: 'administrative', label: 'Administrative', icon: <FaShieldAlt /> },
            { value: 'black', label: 'Black Routes', icon: <FaTimesCircle /> }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition ${
                filterType === filter.value
                  ? 'bg-orange-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Route List */}
          <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Available Routes</h3>
            {routes.map(route => (
              <motion.div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`bg-white rounded-xl p-4 cursor-pointer transition shadow hover:shadow-lg ${
                  selectedRoute?.id === route.id ? 'ring-2 ring-orange-500' : ''
                }`}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg">{route.name}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      {getTypeIcon(route.type)}
                      <span className="capitalize">{route.type.replace('_', ' ')}</span>
                    </div>
                  </div>
                  {getStatusIcon(route.status)}
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-semibold">{route.distance} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Time:</span>
                    <span className="font-semibold">{route.estimatedTime} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Crowd:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCrowdColor(route.crowdLevel)}`}>
                      {route.crowdLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Load:</span>
                    <span className="font-semibold">{route.currentLoad.toLocaleString()} / {route.capacity.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(route.currentLoad / route.capacity) * 100}%`,
                      backgroundColor: getRouteColor(route.type)
                    }}
                  />
                </div>

                {route.status === 'closed' && route.closureReason && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    ⚠️ {route.closureReason}
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Route Map</h3>
              <MapContainer
                key={`${selectedLocation}-${filterType}`}
                center={center}
                zoom={13}
                style={{ height: '550px', borderRadius: '12px' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                {/* Draw Routes */}
                {routes.map(route => {
                  const pathCoords = [
                    [route.start.lat, route.start.lng],
                    ...route.waypoints.map(wp => [wp.lat, wp.lng]),
                    [route.end.lat, route.end.lng]
                  ];

                  return (
                    <React.Fragment key={route.id}>
                      <Polyline
                        positions={pathCoords}
                        color={getRouteColor(route.type)}
                        weight={selectedRoute?.id === route.id ? 6 : 3}
                        opacity={route.status === 'closed' ? 0.3 : 0.8}
                        dashArray={route.status === 'restricted' ? '10, 10' : null}
                      />

                      {/* Start Marker */}
                      <Marker position={[route.start.lat, route.start.lng]}>
                        <Popup>
                          <strong>{route.name}</strong><br />
                          Start: {route.start.name}
                        </Popup>
                      </Marker>

                      {/* End Marker */}
                      <Marker position={[route.end.lat, route.end.lng]}>
                        <Popup>
                          <strong>{route.name}</strong><br />
                          End: {route.end.name}
                        </Popup>
                      </Marker>
                    </React.Fragment>
                  );
                })}

                {/* Parking Zones */}
                {parkingZones.map(zone => {
                  const occupancyRate = (zone.occupied / zone.capacity) * 100;
                  const color = occupancyRate > 90 ? 'red' : occupancyRate > 70 ? 'orange' : 'green';

                  return (
                    <Circle
                      key={zone.id}
                      center={[zone.lat, zone.lng]}
                      radius={200}
                      fillColor={color}
                      fillOpacity={0.3}
                      color={color}
                      weight={2}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{zone.name}</strong><br />
                          Type: {zone.type}<br />
                          Capacity: {zone.capacity}<br />
                          Occupied: {zone.occupied}<br />
                          Available: {zone.capacity - zone.occupied}<br />
                          Vehicles: {zone.vehicleTypes.join(', ')}
                        </div>
                      </Popup>
                    </Circle>
                  );
                })}
              </MapContainer>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {[
                  { type: 'snani', label: 'Bathing Route', color: '#4169E1' },
                  { type: 'vip', label: 'VIP Route', color: '#FFD700' },
                  { type: 'emergency', label: 'Emergency Route', color: '#FF0000' },
                  { type: 'administrative', label: 'Administrative', color: '#8B4789' },
                  { type: 'black', label: 'Black Route', color: '#000000' },
                  { type: 'general', label: 'General Route', color: '#32CD32' }
                ].map(item => (
                  <div key={item.type} className="flex items-center gap-2">
                    <div
                      className="w-6 h-3 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Route Details */}
            {selectedRoute && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-white rounded-2xl shadow-lg p-6"
              >
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  {getTypeIcon(selectedRoute.type)}
                  {selectedRoute.name}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>Start:</strong> {selectedRoute.start.name}
                  </div>
                  <div>
                    <strong>End:</strong> {selectedRoute.end.name}
                  </div>
                  <div>
                    <strong>Distance:</strong> {selectedRoute.distance} km
                  </div>
                  <div>
                    <strong>Time:</strong> {selectedRoute.estimatedTime} min
                  </div>
                  <div>
                    <strong>Status:</strong> <span className="capitalize">{selectedRoute.status}</span>
                  </div>
                  <div>
                    <strong>Crowd:</strong> <span className="capitalize">{selectedRoute.crowdLevel}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <strong>Facilities:</strong>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedRoute.facilities.map((facility, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {facility}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <strong>⚠️ Restrictions:</strong> {selectedRoute.restrictions}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Parking Zones Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <FaParking className="text-blue-600" />
            Parking Zones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {parkingZones.map(zone => {
              const available = zone.capacity - zone.occupied;
              const occupancyRate = Math.round((zone.occupied / zone.capacity) * 100);

              return (
                <div key={zone.id} className="border rounded-xl p-4">
                  <h4 className="font-bold text-lg mb-2">{zone.name}</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-semibold capitalize">{zone.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Capacity:</span>
                      <span className="font-semibold">{zone.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Occupied:</span>
                      <span className="font-semibold">{zone.occupied}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Available:</span>
                      <span className={`font-semibold ${available < 100 ? 'text-red-600' : 'text-green-600'}`}>
                        {available}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        occupancyRate > 90 ? 'bg-red-500' : occupancyRate > 70 ? 'bg-orange-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${occupancyRate}%` }}
                    />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {zone.vehicleTypes.map((type, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 rounded">
                        {type === 'Car' && <FaCar className="inline mr-1" />}
                        {type === 'Bus' && <FaBus className="inline mr-1" />}
                        {type === 'Two-wheeler' && <FaMotorcycle className="inline mr-1" />}
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackNashik;