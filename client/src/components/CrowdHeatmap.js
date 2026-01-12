import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { FaFire, FaUsers, FaExclamationCircle } from 'react-icons/fa';
import { SocketContext } from '../context/SocketContext';
import 'leaflet/dist/leaflet.css';

const CrowdHeatmap = () => {
  const socket = useContext(SocketContext);
  const [crowdZones, setCrowdZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('prayagraj');
  
  // Four sacred Kumbh Mela locations
  const kumbhLocations = {
    prayagraj: { name: 'Prayagraj (Allahabad)', coords: [25.4358, 81.8463], rivers: 'Ganges, Yamuna, Saraswati' },
    haridwar: { name: 'Haridwar', coords: [29.9457, 78.1642], rivers: 'Ganges' },
    nashik: { name: 'Nashik', coords: [19.9975, 73.7898], rivers: 'Godavari' },
    ujjain: { name: 'Ujjain', coords: [23.1765, 75.7885], rivers: 'Shipra' }
  };
  
  const center = kumbhLocations[selectedLocation].coords;

  useEffect(() => {
    // Simulate crowd data for demo
    const generateCrowdData = () => {
      const zones = [
        { id: 1, name: 'Sangam Nose', lat: 25.4358, lng: 81.8463, density: Math.random(), people: Math.floor(Math.random() * 50000) + 10000 },
        { id: 2, name: 'Triveni Ghat', lat: 25.4288, lng: 81.8403, density: Math.random(), people: Math.floor(Math.random() * 40000) + 8000 },
        { id: 3, name: 'Parade Ground', lat: 25.4428, lng: 81.8523, density: Math.random(), people: Math.floor(Math.random() * 35000) + 7000 },
        { id: 4, name: 'Sector 1', lat: 25.4198, lng: 81.8343, density: Math.random(), people: Math.floor(Math.random() * 30000) + 6000 },
        { id: 5, name: 'Sector 2', lat: 25.4518, lng: 81.8583, density: Math.random(), people: Math.floor(Math.random() * 28000) + 5500 },
        { id: 6, name: 'Sector 3', lat: 25.4258, lng: 81.8583, density: Math.random(), people: Math.floor(Math.random() * 25000) + 5000 },
        { id: 7, name: 'Akshayavat', lat: 25.4398, lng: 81.8343, density: Math.random(), people: Math.floor(Math.random() * 22000) + 4500 },
        { id: 8, name: 'Saraswati Ghat', lat: 25.4338, lng: 81.8403, density: Math.random(), people: Math.floor(Math.random() * 20000) + 4000 }
      ];
      setCrowdZones(zones);
    };

    generateCrowdData();
    const interval = setInterval(generateCrowdData, 5000);
    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (density) => {
    if (density < 0.3) return { color: '#10b981', label: 'Low' }; // Green
    if (density < 0.6) return { color: '#f59e0b', label: 'Medium' }; // Orange
    if (density < 0.8) return { color: '#f97316', label: 'High' }; // Dark Orange
    return { color: '#ef4444', label: 'Critical' }; // Red
  };

  const getRadius = (people) => {
    return Math.min(Math.max(people / 100, 200), 800);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Live Crowd Heatmap
            </h1>
            <p className="text-gray-600 text-lg">
              Real-time crowd density monitoring across all four sacred Kumbh Mela locations
            </p>
            
            {/* Location Selector */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {Object.entries(kumbhLocations).map(([key, location]) => (
                <button
                  key={key}
                  onClick={() => setSelectedLocation(key)}
                  className={`px-5 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${
                    selectedLocation === key
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-orange-200'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold">{location.name}</div>
                    <div className="text-xs opacity-80">River: {location.rivers}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <FaFire className="text-saffron-600 mr-2" />
              Crowd Density Legend
            </h3>
            <div className="flex flex-wrap gap-4">
              {[
                { color: '#10b981', label: 'Low (Safe)', range: '0-30%' },
                { color: '#f59e0b', label: 'Medium', range: '30-60%' },
                { color: '#f97316', label: 'High', range: '60-80%' },
                { color: '#ef4444', label: 'Critical (Danger)', range: '80-100%' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <span className="font-medium text-gray-800">{item.label}</span>
                    <span className="text-gray-500 text-sm ml-2">{item.range}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <MapContainer
              key={selectedLocation}
              center={center}
              zoom={14}
              style={{ height: '600px', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {crowdZones.map((zone) => {
                const { color, label } = getDensityColor(zone.density);
                return (
                  <Circle
                    key={zone.id}
                    center={[zone.lat, zone.lng]}
                    radius={getRadius(zone.people)}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.5,
                      weight: 2
                    }}
                    eventHandlers={{
                      click: () => setSelectedZone(zone)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-bold text-lg mb-2">{zone.name}</h3>
                        <div className="space-y-1">
                          <p className="text-sm">
                            <FaUsers className="inline mr-1" />
                            People: <strong>{zone.people.toLocaleString()}</strong>
                          </p>
                          <p className="text-sm">
                            <FaExclamationCircle className="inline mr-1" />
                            Density: <strong>{label}</strong> ({(zone.density * 100).toFixed(0)}%)
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Circle>
                );
              })}
            </MapContainer>
          </div>

          {/* Zone Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {crowdZones.slice(0, 4).map((zone) => {
              const { color, label } = getDensityColor(zone.density);
              return (
                <motion.div
                  key={zone.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-xl shadow-md p-4 cursor-pointer"
                  onClick={() => setSelectedZone(zone)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-800">{zone.name}</h4>
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {zone.people.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">{label} density</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CrowdHeatmap;
