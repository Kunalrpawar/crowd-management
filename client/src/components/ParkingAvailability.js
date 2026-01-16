import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup } from 'react-leaflet';
import { motion } from 'framer-motion';
import { 
  FaParking, FaCar, FaBus, FaMotorcycle, FaTruck, 
  FaCheckCircle, FaTimesCircle, FaMapMarkerAlt, FaFilter 
} from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const ParkingAvailability = () => {
  const [selectedLocation, setSelectedLocation] = useState('prayagraj');
  const [parkingZones, setParkingZones] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [stats, setStats] = useState({});

  const kumbhLocations = {
    prayagraj: { name: 'Prayagraj (Allahabad)', coords: [25.4358, 81.8463] },
    haridwar: { name: 'Haridwar', coords: [29.9457, 78.1642] },
    nashik: { name: 'Nashik', coords: [19.9975, 73.7898] },
    ujjain: { name: 'Ujjain', coords: [23.1765, 75.7885] }
  };

  const center = kumbhLocations[selectedLocation].coords;

  useEffect(() => {
    fetchParkingData();
    const interval = setInterval(fetchParkingData, 30000);
    return () => clearInterval(interval);
  }, [selectedLocation, filterType]);

  const fetchParkingData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/parking?location=${selectedLocation}${filterType !== 'all' ? `&type=${filterType}` : ''}`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        setParkingZones(data.data.map(zone => ({
          ...zone,
          id: zone._id,
          occupancyRate: ((zone.occupied / zone.capacity) * 100).toFixed(1)
        })));
        
        // Fetch stats
        const statsResponse = await fetch(`http://localhost:5000/api/parking/stats?location=${selectedLocation}`);
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
          setStats(statsData.data);
        }
      } else {
        // Fallback to generated data if no database data
        generateParkingData();
      }
    } catch (error) {
      console.error('Error fetching parking data:', error);
      // Fallback to generated data on error
      generateParkingData();
    }
  };

  const generateParkingData = () => {
    const parkingLocations = {
      prayagraj: [
        { name: 'Sangam Parking Zone A', offset: [0.005, 0.005], type: 'multi', capacity: 1500 },
        { name: 'Sangam Parking Zone B', offset: [-0.005, 0.005], type: 'multi', capacity: 1200 },
        { name: 'Triveni Parking', offset: [-0.010, -0.008], type: 'car', capacity: 800 },
        { name: 'Parade Ground Parking', offset: [0.010, 0.008], type: 'bus', capacity: 300 },
        { name: 'Sector 1 Parking', offset: [-0.020, -0.015], type: 'multi', capacity: 2000 },
        { name: 'Sector 2 Parking', offset: [0.020, 0.015], type: 'multi', capacity: 1800 },
        { name: 'Two Wheeler Zone A', offset: [0.008, -0.010], type: 'bike', capacity: 3000 },
        { name: 'Two Wheeler Zone B', offset: [-0.008, 0.010], type: 'bike', capacity: 2500 },
        { name: 'Bus Terminal Parking', offset: [0.015, -0.012], type: 'bus', capacity: 500 },
        { name: 'VIP Parking Zone', offset: [-0.012, -0.010], type: 'car', capacity: 200 }
      ],
      haridwar: [
        { name: 'Har Ki Pauri Parking', offset: [0, 0], type: 'multi', capacity: 1000 },
        { name: 'Brahma Kund Parking', offset: [0.008, 0.008], type: 'car', capacity: 600 },
        { name: 'Mansa Devi Parking', offset: [0.040, 0.010], type: 'multi', capacity: 1500 },
        { name: 'Chandi Devi Parking', offset: [0.060, 0.025], type: 'multi', capacity: 1200 },
        { name: 'Two Wheeler Zone', offset: [-0.008, 0.008], type: 'bike', capacity: 2000 },
        { name: 'Bus Terminal', offset: [0.012, -0.010], type: 'bus', capacity: 400 },
        { name: 'Railway Station Parking', offset: [-0.015, -0.012], type: 'multi', capacity: 1800 },
        { name: 'ISBT Parking', offset: [0.018, 0.015], type: 'bus', capacity: 600 }
      ],
      nashik: [
        { name: 'Ramkund Main Parking', offset: [0, 0], type: 'multi', capacity: 1200 },
        { name: 'Panchavati Parking', offset: [0.010, 0.010], type: 'car', capacity: 800 },
        { name: 'Sita Gufa Parking', offset: [-0.008, -0.008], type: 'multi', capacity: 600 },
        { name: 'Kalaram Temple Parking', offset: [0.008, 0.012], type: 'car', capacity: 500 },
        { name: 'Two Wheeler Zone A', offset: [-0.010, 0.008], type: 'bike', capacity: 2500 },
        { name: 'Two Wheeler Zone B', offset: [0.012, -0.010], type: 'bike', capacity: 2000 },
        { name: 'Bus Stand Parking', offset: [-0.015, -0.012], type: 'bus', capacity: 350 },
        { name: 'Trimbak Road Parking', offset: [-0.060, -0.260], type: 'multi', capacity: 1500 },
        { name: 'Gangapur Road Parking', offset: [-0.020, -0.020], type: 'multi', capacity: 1000 },
        { name: 'Tapovan Parking', offset: [0.015, 0.015], type: 'car', capacity: 400 }
      ],
      ujjain: [
        { name: 'Ram Ghat Parking', offset: [0, 0], type: 'multi', capacity: 1000 },
        { name: 'Mahakaleshwar Parking', offset: [0.006, -0.020], type: 'multi', capacity: 1500 },
        { name: 'Harsiddhi Temple Parking', offset: [0.002, 0.002], type: 'car', capacity: 400 },
        { name: 'Kal Bhairav Parking', offset: [0.004, 0.004], type: 'car', capacity: 300 },
        { name: 'Two Wheeler Zone', offset: [-0.008, 0.008], type: 'bike', capacity: 2000 },
        { name: 'Bus Terminal', offset: [0.010, -0.008], type: 'bus', capacity: 400 },
        { name: 'Railway Station Parking', offset: [-0.012, -0.010], type: 'multi', capacity: 1200 },
        { name: 'Mangalnath Parking', offset: [0.023, -0.022], type: 'car', capacity: 500 }
      ]
    };

    const zones = parkingLocations[selectedLocation]
      .filter(zone => filterType === 'all' || zone.type === filterType || zone.type === 'multi')
      .map((zone, index) => {
        const occupied = Math.floor(zone.capacity * (0.4 + Math.random() * 0.5));
        const available = zone.capacity - occupied;
        const occupancyRate = (occupied / zone.capacity) * 100;

        return {
          id: index + 1,
          name: zone.name,
          lat: center[0] + zone.offset[0],
          lng: center[1] + zone.offset[1],
          type: zone.type,
          capacity: zone.capacity,
          occupied: occupied,
          available: available,
          occupancyRate: occupancyRate,
          status: occupancyRate > 90 ? 'full' : occupancyRate > 70 ? 'filling' : 'available'
        };
      });

    setParkingZones(zones);

    // Calculate stats
    const totalCapacity = zones.reduce((sum, zone) => sum + zone.capacity, 0);
    const totalOccupied = zones.reduce((sum, zone) => sum + zone.occupied, 0);
    const totalAvailable = zones.reduce((sum, zone) => sum + zone.available, 0);

    setStats({
      totalZones: zones.length,
      totalCapacity,
      totalOccupied,
      totalAvailable,
      occupancyRate: ((totalOccupied / totalCapacity) * 100).toFixed(1)
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return 'green';
      case 'filling': return 'orange';
      case 'full': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <FaCheckCircle className="text-green-600" />;
      case 'filling': return <FaCheckCircle className="text-orange-600" />;
      case 'full': return <FaTimesCircle className="text-red-600" />;
      default: return null;
    }
  };

  const getVehicleIcon = (type) => {
    switch (type) {
      case 'car': return <FaCar />;
      case 'bus': return <FaBus />;
      case 'bike': return <FaMotorcycle />;
      case 'multi': return <FaTruck />;
      default: return <FaParking />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🅿️ Parking Availability System
          </h1>
          <p className="text-xl text-gray-600">
            Real-time parking space monitoring across all Kumbh Mela locations
          </p>
        </motion.div>

        {/* Location Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(kumbhLocations).map(([key, location]) => (
            <button
              key={key}
              onClick={() => {
                setSelectedLocation(key);
              }}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${
                selectedLocation === key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-blue-200'
              }`}
            >
              {location.name}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-4 shadow-lg"
          >
            <div className="text-3xl font-bold text-blue-600">{stats.totalZones}</div>
            <div className="text-sm text-gray-600">Parking Zones</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-4 shadow-lg"
          >
            <div className="text-3xl font-bold text-purple-600">{stats.totalCapacity?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Capacity</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-4 shadow-lg"
          >
            <div className="text-3xl font-bold text-green-600">{stats.totalAvailable?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Available Spaces</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-4 shadow-lg"
          >
            <div className="text-3xl font-bold text-red-600">{stats.totalOccupied?.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Occupied</div>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-xl p-4 shadow-lg"
          >
            <div className="text-3xl font-bold text-orange-600">{stats.occupancyRate}%</div>
            <div className="text-sm text-gray-600">Occupancy Rate</div>
          </motion.div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {[
            { value: 'all', label: 'All Parking', icon: <FaParking /> },
            { value: 'car', label: 'Cars Only', icon: <FaCar /> },
            { value: 'bus', label: 'Buses', icon: <FaBus /> },
            { value: 'bike', label: 'Two Wheelers', icon: <FaMotorcycle /> }
          ].map(filter => (
            <button
              key={filter.value}
              onClick={() => setFilterType(filter.value)}
              className={`px-5 py-2 rounded-lg flex items-center gap-2 font-semibold transition shadow ${
                filterType === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Parking List */}
          <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-blue-600" />
              Parking Zones
            </h3>
            {parkingZones.map(zone => (
              <motion.div
                key={zone.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-4 shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold text-lg flex items-center gap-2">
                      {getVehicleIcon(zone.type)}
                      {zone.name}
                    </h4>
                    <div className="text-sm text-gray-600 capitalize">
                      {zone.type === 'multi' ? 'All Vehicles' : zone.type}
                    </div>
                  </div>
                  {getStatusIcon(zone.status)}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Capacity:</span>
                    <span className="font-semibold">{zone.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available:</span>
                    <span className="font-semibold text-green-600">{zone.available.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Occupied:</span>
                    <span className="font-semibold text-red-600">{zone.occupied.toLocaleString()}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all"
                    style={{
                      width: `${zone.occupancyRate}%`,
                      backgroundColor: getStatusColor(zone.status)
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {zone.occupancyRate.toFixed(0)}% Full
                </div>

                {zone.status === 'full' && (
                  <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                    ⚠️ Parking Full - Please use alternate zones
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4">Parking Map</h3>
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

                {/* Parking Zones */}
                {parkingZones.map(zone => (
                  <React.Fragment key={zone.id}>
                    <Circle
                      center={[zone.lat, zone.lng]}
                      radius={150}
                      fillColor={getStatusColor(zone.status)}
                      fillOpacity={0.4}
                      color={getStatusColor(zone.status)}
                      weight={2}
                    />
                    <Marker position={[zone.lat, zone.lng]}>
                      <Popup>
                        <div className="text-sm p-2">
                          <strong className="text-base">{zone.name}</strong><br />
                          <div className="mt-2 space-y-1">
                            <div>Type: <strong className="capitalize">{zone.type === 'multi' ? 'All Vehicles' : zone.type}</strong></div>
                            <div>Capacity: <strong>{zone.capacity}</strong></div>
                            <div>Available: <strong className="text-green-600">{zone.available}</strong></div>
                            <div>Occupied: <strong className="text-red-600">{zone.occupied}</strong></div>
                            <div>Status: <strong className="capitalize">{zone.status}</strong></div>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  </React.Fragment>
                ))}
              </MapContainer>

              {/* Legend */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500" />
                  <span>Available (&lt;70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-500" />
                  <span>Filling (70-90%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-red-500" />
                  <span>Full (&gt;90%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingAvailability;
