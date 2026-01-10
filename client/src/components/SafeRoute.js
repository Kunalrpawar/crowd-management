import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import { FaRoute, FaMapMarkerAlt, FaClock, FaWalking } from 'react-icons/fa';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SafeRoute = () => {
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const center = [25.4358, 81.8463];

  const locations = [
    { name: 'Sangam Nose', coords: [25.4358, 81.8463] },
    { name: 'Triveni Ghat', coords: [25.4288, 81.8403] },
    { name: 'Parade Ground', coords: [25.4428, 81.8523] },
    { name: 'Sector 1', coords: [25.4198, 81.8343] },
    { name: 'Sector 2', coords: [25.4518, 81.8583] },
    { name: 'Akshayavat', coords: [25.4398, 81.8343] },
    { name: 'Saraswati Ghat', coords: [25.4338, 81.8403] },
  ];

  const findRoute = () => {
    setLoading(true);
    
    // Simulate route calculation
    setTimeout(() => {
      const start = locations.find(loc => loc.name === startPoint);
      const end = locations.find(loc => loc.name === endPoint);

      if (start && end) {
        // Generate a simple route with waypoints
        const waypoints = [
          start.coords,
          [(start.coords[0] + end.coords[0]) / 2, (start.coords[1] + end.coords[1]) / 2],
          end.coords
        ];

        setRoute({
          path: waypoints,
          distance: (Math.random() * 3 + 1).toFixed(1),
          time: Math.floor(Math.random() * 20 + 10),
          crowdLevel: Math.random() < 0.5 ? 'Low' : 'Medium',
          start: start,
          end: end
        });
      }
      setLoading(false);
    }, 1500);
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
              Safe Route Planner
            </h1>
            <p className="text-gray-600 text-lg">
              AI-powered route suggestions avoiding crowded areas
            </p>
          </div>

          {/* Route Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                  Starting Point
                </label>
                <select
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                >
                  <option value="">Select starting point</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                  Destination
                </label>
                <select
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                >
                  <option value="">Select destination</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={findRoute}
                  disabled={!startPoint || !endPoint || loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-saffron-500 to-spiritual-green text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                >
                  {loading ? 'Finding Route...' : 'Find Safe Route'}
                </motion.button>
              </div>
            </div>

            {/* Route Info */}
            {route && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <FaRoute className="text-2xl text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">Distance</p>
                  <p className="text-2xl font-bold text-gray-800">{route.distance} km</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <FaClock className="text-2xl text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">Est. Time</p>
                  <p className="text-2xl font-bold text-gray-800">{route.time} min</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <FaWalking className="text-2xl text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">Crowd Level</p>
                  <p className="text-2xl font-bold text-gray-800">{route.crowdLevel}</p>
                </div>
                <div className="bg-gradient-to-br from-saffron-50 to-saffron-100 rounded-lg p-4">
                  <div className="text-2xl mb-2">✓</div>
                  <p className="text-sm text-gray-600">Safety</p>
                  <p className="text-2xl font-bold text-gray-800">High</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <MapContainer
              center={center}
              zoom={13}
              style={{ height: '600px', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Location markers */}
              {locations.map((loc, index) => (
                <Marker key={index} position={loc.coords}>
                  <Popup>
                    <strong>{loc.name}</strong>
                  </Popup>
                </Marker>
              ))}

              {/* Route path */}
              {route && (
                <>
                  <Polyline
                    positions={route.path}
                    color="#10b981"
                    weight={5}
                    opacity={0.7}
                  />
                  <Marker position={route.start.coords}>
                    <Popup>
                      <strong>Start: {route.start.name}</strong>
                    </Popup>
                  </Marker>
                  <Marker position={route.end.coords}>
                    <Popup>
                      <strong>Destination: {route.end.name}</strong>
                    </Popup>
                  </Marker>
                </>
              )}
            </MapContainer>
          </div>

          {/* Safety Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-saffron-50 to-green-50 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Safety Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                'Stay on designated paths',
                'Keep emergency contacts handy',
                'Follow crowd control instructions',
                'Avoid peak hours if possible',
                'Stay hydrated and take breaks',
                'Use buddy system for groups'
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-saffron-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SafeRoute;
