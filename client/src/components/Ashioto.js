import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaWalking, FaExclamationTriangle, FaChartBar, FaMapMarkerAlt,
  FaSave, FaDownload, FaUsers, FaShieldAlt, FaDatabase
} from 'react-icons/fa';

const Ashioto = () => {
  const [outCount, setOutCount] = useState(6921);
  const [density, setDensity] = useState(0.0);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isRecording, setIsRecording] = useState(true);

  // Mock sensor data for multiple locations
  const sensorLocations = [
    {
      id: 1,
      name: 'Nashik Main Ghat',
      zone: 'Zone A',
      outCount: 6921,
      inCount: 6523,
      density: 0.65,
      capacity: 10000,
      status: 'safe',
      sensors: 12,
      lastUpdate: '2 min ago'
    },
    {
      id: 2,
      name: 'Ramkund Area',
      zone: 'Zone B',
      outCount: 8234,
      inCount: 8890,
      density: 0.89,
      capacity: 10000,
      status: 'warning',
      sensors: 16,
      lastUpdate: '1 min ago'
    },
    {
      id: 3,
      name: 'Panchavati Temple',
      zone: 'Zone C',
      outCount: 4567,
      inCount: 4234,
      density: 0.42,
      capacity: 10000,
      status: 'safe',
      sensors: 10,
      lastUpdate: '3 min ago'
    },
    {
      id: 4,
      name: 'Godavari Riverbank',
      zone: 'Zone D',
      outCount: 9123,
      inCount: 9456,
      density: 0.95,
      capacity: 10000,
      status: 'critical',
      sensors: 14,
      lastUpdate: '30 sec ago'
    }
  ];

  const stats = {
    totalFootpads: 52,
    activeZones: 4,
    avgDensity: 0.73,
    totalPeople: 29845,
    alerts: 2
  };

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      if (isRecording) {
        setOutCount(prev => prev + Math.floor(Math.random() * 50));
        setDensity(prev => Math.min(1.0, prev + (Math.random() - 0.5) * 0.1));
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const getStatusColor = (status) => {
    const colors = {
      safe: 'bg-green-100 text-green-800 border-green-500',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-500',
      critical: 'bg-red-100 text-red-800 border-red-500'
    };
    return colors[status] || colors.safe;
  };

  const getStatusIcon = (status) => {
    if (status === 'critical') return '🚨';
    if (status === 'warning') return '⚠️';
    return '✅';
  };

  const getDensityColor = (density) => {
    if (density >= 0.8) return 'text-red-600';
    if (density >= 0.6) return 'text-yellow-600';
    return 'text-green-600';
  };

  const handleSave = () => {
    alert('Data saved to server successfully!');
  };

  const handleSaveLocally = () => {
    const data = {
      outCount,
      density,
      timestamp: new Date().toISOString(),
      locations: sensorLocations
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ashioto-data-${Date.now()}.json`;
    a.click();
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
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <FaWalking className="text-purple-600" />
            Ashioto - Foot Mat Crowd Steering
          </h1>
          <p className="text-xl text-gray-600">
            Real-time foot traffic monitoring for stampede prevention
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              👣 Footpad Sensors
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              📊 Real-time Metrics
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              🚨 Stampede Prevention
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              ⚡ Instant Alerts
            </span>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">👣</div>
            <div className="text-2xl font-bold text-gray-800">{stats.totalFootpads}</div>
            <div className="text-sm text-gray-600">Total Footpads</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🗺️</div>
            <div className="text-2xl font-bold text-gray-800">{stats.activeZones}</div>
            <div className="text-sm text-gray-600">Active Zones</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold text-yellow-600">{(stats.avgDensity * 100).toFixed(0)}%</div>
            <div className="text-sm text-gray-600">Avg Density</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">👥</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalPeople.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total People</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🚨</div>
            <div className="text-2xl font-bold text-red-600">{stats.alerts}</div>
            <div className="text-sm text-gray-600">Active Alerts</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Display */}
          <div className="lg:col-span-2 space-y-6">
            {/* ASHIOTO System Display */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl shadow-2xl p-8 text-white">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <FaDatabase className="text-cyan-400" />
                ASHIOTO System
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* OUT Count */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-center shadow-xl">
                  <div className="text-sm uppercase tracking-wider mb-2">OUT Count</div>
                  <div className="text-6xl font-bold mb-2">{outCount.toLocaleString()}</div>
                  <div className="text-sm opacity-75">People Exited</div>
                </div>

                {/* DENSITY */}
                <div className={`bg-gradient-to-br ${
                  density >= 0.8 ? 'from-red-600 to-red-800' :
                  density >= 0.6 ? 'from-yellow-600 to-yellow-800' :
                  'from-green-600 to-green-800'
                } rounded-lg p-6 text-center shadow-xl`}>
                  <div className="text-sm uppercase tracking-wider mb-2">Density</div>
                  <div className="text-6xl font-bold mb-2">{density.toFixed(1)}</div>
                  <div className="text-sm opacity-75">Crowd Density Level</div>
                </div>
              </div>

              {/* Control Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={handleSave}
                  className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FaSave />
                  SAVE
                </button>
                <button
                  onClick={handleSaveLocally}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <FaDownload />
                  SAVE LOCALLY
                </button>
                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`${
                    isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
                  } px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition`}
                >
                  {isRecording ? '⏸️ PAUSE' : '▶️ RESUME'}
                </button>
                <button
                  onClick={() => {
                    setOutCount(0);
                    setDensity(0.0);
                  }}
                  className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  🔄 RESET
                </button>
              </div>

              {/* Recording Status */}
              <div className="mt-4 text-center">
                {isRecording ? (
                  <div className="text-green-400 flex items-center justify-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    Recording Active
                  </div>
                ) : (
                  <div className="text-gray-400">Recording Paused</div>
                )}
              </div>
            </div>

            {/* Location Monitors */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                Location Monitoring
              </h3>

              <div className="space-y-4">
                {sensorLocations.map((location) => (
                  <motion.div
                    key={location.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border-l-4 ${getStatusColor(location.status)}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          {getStatusIcon(location.status)} {location.name}
                        </h4>
                        <p className="text-sm text-gray-600">{location.zone} • {location.sensors} sensors</p>
                      </div>
                      <div className="text-xs text-gray-500">{location.lastUpdate}</div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{location.outCount}</div>
                        <div className="text-xs text-gray-600">Out</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{location.inCount}</div>
                        <div className="text-xs text-gray-600">In</div>
                      </div>
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${getDensityColor(location.density)}`}>
                          {(location.density * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-600">Density</div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${
                          location.density >= 0.8 ? 'bg-red-500' :
                          location.density >= 0.6 ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${location.density * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      Capacity: {location.capacity.toLocaleString()} people
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" />
                Critical Alerts
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded">
                  <div className="font-semibold text-sm">🚨 High Density Alert</div>
                  <div className="text-xs text-gray-600 mt-1">Godavari Riverbank</div>
                  <div className="text-xs text-red-700 mt-2">
                    Density at 95% - Immediate action required
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <div className="font-semibold text-sm">⚠️ Moderate Alert</div>
                  <div className="text-xs text-gray-600 mt-1">Ramkund Area</div>
                  <div className="text-xs text-yellow-700 mt-2">
                    Density at 89% - Monitor closely
                  </div>
                </div>
              </div>
            </div>

            {/* System Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaChartBar className="text-purple-500" />
                System Information
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sensor Type:</span>
                  <span className="font-semibold">Footpad Pressure</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Update Frequency:</span>
                  <span className="font-semibold">2 seconds</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Accuracy:</span>
                  <span className="font-semibold text-green-600">98.5%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">System Status:</span>
                  <span className="font-semibold text-green-600">✅ Operational</span>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaShieldAlt />
                Key Benefits
              </h3>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Prevents overcrowding and stampedes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Accurate real-time crowd data</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Automated alert system</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Easy deployment at large events</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✅</span>
                  <span>Data visualization in real-time</span>
                </li>
              </ul>
            </div>

            {/* Hardware Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Hardware Components</h3>

              <div className="space-y-2 text-sm">
                <div className="p-2 bg-gray-50 rounded">
                  <strong>Footpad Sensors:</strong> Pressure-sensitive mats
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <strong>Processing Unit:</strong> Real-time data processor
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <strong>Transmission:</strong> Wireless IoT connectivity
                </div>
                <div className="p-2 bg-gray-50 rounded">
                  <strong>Power:</strong> Solar + Battery backup
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Problem Statement & Solution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2 text-red-600">❌ Problems with Current Solutions:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Infrastructure limitations</li>
                <li>• Difficulty gathering real-time data</li>
                <li>• Complex deployment processes</li>
                <li>• Inaccurate crowd estimates</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-600">✅ Ashioto Solution:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Portable footpad sensor system</li>
                <li>• Real-time accurate data collection</li>
                <li>• Easy deployment at any scale</li>
                <li>• Precise foot traffic measurement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ashioto;
