import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Circle, Popup, useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import { FaFire, FaUsers, FaExclamationCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { SocketContext } from '../context/SocketContext';
import 'leaflet/dist/leaflet.css';

const CrowdHeatmap = () => {
  const { t } = useTranslation();
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
    // Initialize crowd data with more stable values
    const initializeCrowdData = () => {
      const locationOffsets = {
        prayagraj: [
          { name: 'Sangam Nose', offset: [0, 0], baseDensity: 0.65 },
          { name: 'Triveni Ghat', offset: [-0.007, -0.006], baseDensity: 0.45 },
          { name: 'Parade Ground', offset: [0.007, 0.006], baseDensity: 0.35 },
          { name: 'Sector 1', offset: [-0.016, -0.012], baseDensity: 0.25 },
          { name: 'Sector 2', offset: [0.016, 0.012], baseDensity: 0.30 },
          { name: 'Sector 3', offset: [-0.010, 0.012], baseDensity: 0.28 },
          { name: 'Akshayavat', offset: [0.004, -0.012], baseDensity: 0.40 },
          { name: 'Saraswati Ghat', offset: [-0.002, -0.006], baseDensity: 0.50 }
        ],
        haridwar: [
          { name: 'Har Ki Pauri', offset: [0, 0], baseDensity: 0.70 },
          { name: 'Brahma Kund', offset: [0.005, 0.005], baseDensity: 0.55 },
          { name: 'Gau Ghat', offset: [-0.005, 0.005], baseDensity: 0.38 },
          { name: 'Vishnu Ghat', offset: [0.007, -0.007], baseDensity: 0.42 },
          { name: 'Kankhal', offset: [-0.010, -0.008], baseDensity: 0.30 },
          { name: 'Subhash Ghat', offset: [0.006, 0.008], baseDensity: 0.35 },
          { name: 'Kushavarta Ghat', offset: [-0.008, -0.005], baseDensity: 0.48 },
          { name: 'Birla Ghat', offset: [0.009, -0.006], baseDensity: 0.32 }
        ],
        nashik: [
          { name: 'Ramkund', offset: [0, 0], baseDensity: 0.68 },
          { name: 'Panchavati', offset: [0.008, 0.008], baseDensity: 0.52 },
          { name: 'Sundar Narayan', offset: [-0.006, 0.006], baseDensity: 0.40 },
          { name: 'Triveni Sangam', offset: [0.010, -0.010], baseDensity: 0.58 },
          { name: 'Gangapur Road', offset: [-0.012, -0.012], baseDensity: 0.28 },
          { name: 'Tapovan', offset: [0.009, 0.010], baseDensity: 0.33 },
          { name: 'Sita Gufa', offset: [-0.008, -0.008], baseDensity: 0.36 },
          { name: 'Kapaleshwar', offset: [0.007, -0.009], baseDensity: 0.44 }
        ],
        ujjain: [
          { name: 'Ram Ghat', offset: [0, 0], baseDensity: 0.62 },
          { name: 'Mangalnath', offset: [0.006, 0.006], baseDensity: 0.48 },
          { name: 'Kalbhairav', offset: [-0.008, 0.007], baseDensity: 0.54 },
          { name: 'Shipra River Bank', offset: [0.009, -0.009], baseDensity: 0.38 },
          { name: 'Mahakaleshwar', offset: [-0.010, -0.008], baseDensity: 0.72 },
          { name: 'Siddha Nath', offset: [0.007, 0.009], baseDensity: 0.34 },
          { name: 'Triveni Sangam', offset: [-0.009, -0.010], baseDensity: 0.46 },
          { name: 'Gandharva Nath', offset: [0.008, -0.007], baseDensity: 0.40 }
        ]
      };

      const zones = locationOffsets[selectedLocation].map((zone, index) => ({
        id: index + 1,
        name: zone.name,
        lat: center[0] + zone.offset[0],
        lng: center[1] + zone.offset[1],
        density: zone.baseDensity + (Math.random() * 0.1 - 0.05), // Small random variation
        people: Math.floor(zone.baseDensity * 50000) + Math.floor(Math.random() * 5000)
      }));

      setCrowdZones(zones);
    };

    // Update with very gradual changes
    const updateCrowdData = () => {
      setCrowdZones(prevZones => 
        prevZones.map(zone => ({
          ...zone,
          density: Math.max(0.1, Math.min(0.95, zone.density + (Math.random() * 0.04 - 0.02))), // Very small gradual change
          people: Math.max(5000, Math.min(60000, zone.people + Math.floor(Math.random() * 2000 - 1000)))
        }))
      );
    };

    initializeCrowdData();
    const interval = setInterval(updateCrowdData, 60000); // Update every 60 seconds with small changes
    return () => clearInterval(interval);
  }, [selectedLocation, center]);

  const getDensityColor = (density) => {
    if (density < 0.3) return { color: '#10b981', label: t('crowd.low') }; // Green
    if (density < 0.6) return { color: '#f59e0b', label: t('crowd.medium') }; // Orange
    if (density < 0.8) return { color: '#f97316', label: t('crowd.high') }; // Dark Orange
    return { color: '#ef4444', label: t('crowd.critical') }; // Red
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
              {t('crowd.heatmapTitle')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('crowd.heatmapSubtitle')}
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
                    <div className="text-xs opacity-80">{t('crowd.river')}: {location.rivers}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <FaFire className="text-saffron-600 mr-2" />
              {t('crowd.legend')}
            </h3>
            <div className="flex flex-wrap gap-4">
              {[
                { color: '#10b981', label: `${t('crowd.low')} (${t('common.safe')})`, range: '0-30%' },
                { color: '#f59e0b', label: t('crowd.medium'), range: '30-60%' },
                { color: '#f97316', label: t('crowd.high'), range: '60-80%' },
                { color: '#ef4444', label: `${t('crowd.critical')} (${t('common.danger')})`, range: '80-100%' }
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
