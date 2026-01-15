import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FaMobileAlt, FaBroadcastTower, FaUsers, FaMapMarkedAlt,
  FaChartLine, FaRoute, FaExclamationTriangle, FaDownload
} from 'react-icons/fa';

const CrowdSteeringMobile = () => {
  const [selectedZone, setSelectedZone] = useState(null);
  const [realTimeData, setRealTimeData] = useState({
    totalDevices: 145680,
    activeOperators: 3,
    cellTowers: 24,
    lastUpdate: new Date().toLocaleTimeString()
  });

  // Telecom operators data
  const operators = [
    {
      name: 'Jio',
      subscribers: 62340,
      color: '#0066CC',
      coverage: '95%',
      towers: 10
    },
    {
      name: 'Airtel',
      subscribers: 48920,
      color: '#E60000',
      coverage: '92%',
      towers: 8
    },
    {
      name: 'Vi (Vodafone Idea)',
      subscribers: 34420,
      color: '#E60012',
      coverage: '88%',
      towers: 6
    }
  ];

  // Crowd zones with density data
  const zones = [
    {
      id: 'A',
      name: 'Nashik Main Ghat',
      devices: 45680,
      density: 'high',
      color: '#EF4444',
      percentage: 92,
      coordinates: { lat: 19.9975, lng: 73.7898 },
      cellTowers: 8,
      status: 'critical',
      trend: 'increasing'
    },
    {
      id: 'B',
      name: 'Ramkund Area',
      devices: 58920,
      density: 'very-high',
      color: '#DC2626',
      percentage: 98,
      coordinates: { lat: 20.0063, lng: 73.7868 },
      cellTowers: 10,
      status: 'critical',
      trend: 'stable'
    },
    {
      id: 'C',
      name: 'Panchavati Zone',
      devices: 41080,
      density: 'medium',
      color: '#F59E0B',
      percentage: 65,
      coordinates: { lat: 20.0104, lng: 73.7685 },
      cellTowers: 6,
      status: 'moderate',
      trend: 'decreasing'
    }
  ];

  // Traffic hotspots
  const hotspots = [
    {
      location: 'Ramkund Junction',
      deviceCount: 12400,
      severity: 'high',
      actionTaken: 'Route diversion activated'
    },
    {
      location: 'Godavari Bridge',
      deviceCount: 9800,
      severity: 'medium',
      actionTaken: 'Traffic monitoring active'
    },
    {
      location: 'Panchavati Entry',
      deviceCount: 6200,
      severity: 'low',
      actionTaken: 'Normal flow'
    }
  ];

  // Sadhu movement tracking
  const sadhuMovements = [
    {
      group: 'Juna Akhara',
      count: 2500,
      currentLocation: 'Zone B',
      destination: 'Zone A',
      eta: '15 min'
    },
    {
      group: 'Niranjani Akhara',
      count: 1800,
      currentLocation: 'Zone C',
      destination: 'Zone B',
      eta: '25 min'
    },
    {
      group: 'Mahanirvani Akhara',
      count: 2100,
      currentLocation: 'Zone A',
      destination: 'Bathing Ghat',
      eta: '10 min'
    }
  ];

  const impactStats = [
    { label: 'Crowd Sites Enabled', value: '15+', icon: '📍' },
    { label: 'Traffic Hotspots Improved', value: '23', icon: '🚦' },
    { label: 'Sadhu Movements Tracked', value: '6,400+', icon: '🚶‍♂️' },
    { label: 'Route Optimizations', value: '145', icon: '🗺️' }
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        totalDevices: prev.totalDevices + Math.floor(Math.random() * 200 - 100),
        lastUpdate: new Date().toLocaleTimeString()
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getDensityColor = (density) => {
    const colors = {
      'low': '#10B981',
      'medium': '#F59E0B',
      'high': '#EF4444',
      'very-high': '#DC2626'
    };
    return colors[density] || colors.low;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'critical': 'bg-red-100 text-red-800 border-red-500',
      'moderate': 'bg-yellow-100 text-yellow-800 border-yellow-500',
      'normal': 'bg-green-100 text-green-800 border-green-500'
    };
    return badges[status] || badges.normal;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'increasing') return '📈';
    if (trend === 'decreasing') return '📉';
    return '➡️';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <FaMobileAlt className="text-blue-600" />
            Crowd Steering using Mobile Data
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Real-time crowd monitoring via mobile network data
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              📱 Device Tracking
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              📊 Data Aggregation
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              🗺️ Route Planning
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              🎯 Real-time Decisions
            </span>
          </div>
        </motion.div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">📱</div>
            <div className="text-2xl font-bold text-blue-600">{realTimeData.totalDevices.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total Devices</div>
            <div className="text-xs text-green-600 mt-1">Live</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">📡</div>
            <div className="text-2xl font-bold text-purple-600">{realTimeData.cellTowers}</div>
            <div className="text-sm text-gray-600">Cell Towers</div>
            <div className="text-xs text-gray-500 mt-1">Active</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">🏢</div>
            <div className="text-2xl font-bold text-green-600">{realTimeData.activeOperators}</div>
            <div className="text-sm text-gray-600">Operators</div>
            <div className="text-xs text-gray-500 mt-1">Integrated</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-lg text-center"
          >
            <div className="text-3xl mb-2">⏱️</div>
            <div className="text-lg font-bold text-orange-600">{realTimeData.lastUpdate}</div>
            <div className="text-sm text-gray-600">Last Update</div>
            <div className="text-xs text-gray-500 mt-1">Auto-refresh: 5s</div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Heat Map Zones */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkedAlt className="text-blue-500" />
                Crowd Density Heat Map
              </h3>

              <div className="space-y-4">
                {zones.map((zone) => (
                  <motion.div
                    key={zone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedZone(selectedZone === zone.id ? null : zone.id)}
                    className={`p-5 rounded-lg border-2 cursor-pointer transition ${
                      selectedZone === zone.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-xl flex items-center gap-2">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
                            style={{ backgroundColor: zone.color }}>
                            {zone.id}
                          </span>
                          {zone.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {zone.cellTowers} Cell Towers • {zone.devices.toLocaleString()} Devices
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusBadge(zone.status)}`}>
                          {zone.status.toUpperCase()}
                        </div>
                        <div className="text-2xl mt-1">{getTrendIcon(zone.trend)}</div>
                      </div>
                    </div>

                    {/* Density Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Density Level</span>
                        <span className="font-bold">{zone.percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="h-4 rounded-full transition-all duration-500"
                          style={{
                            width: `${zone.percentage}%`,
                            backgroundColor: zone.color
                          }}
                        ></div>
                      </div>
                    </div>

                    {selectedZone === zone.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t grid grid-cols-2 gap-3"
                      >
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Latitude</div>
                          <div className="font-bold">{zone.coordinates.lat}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Longitude</div>
                          <div className="font-bold">{zone.coordinates.lng}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Density Type</div>
                          <div className="font-bold capitalize">{zone.density.replace('-', ' ')}</div>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                          <div className="text-xs text-gray-600">Trend</div>
                          <div className="font-bold capitalize">{zone.trend}</div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold mb-2">Density Legend:</div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm">Low (0-40%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm">Medium (41-70%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm">High (71-90%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-700 rounded"></div>
                    <span className="text-sm">Very High (91-100%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Telecom Operators */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaBroadcastTower className="text-purple-500" />
                Telecom Operators Data
              </h3>

              <div className="space-y-4">
                {operators.map((operator, index) => (
                  <motion.div
                    key={operator.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border-2 border-gray-200"
                    style={{ borderLeftColor: operator.color, borderLeftWidth: '4px' }}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-bold text-lg" style={{ color: operator.color }}>
                        {operator.name}
                      </h4>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">
                          {operator.subscribers.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-600">Subscribers</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-600">Coverage</div>
                        <div className="font-bold">{operator.coverage}</div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-xs text-gray-600">Cell Towers</div>
                        <div className="font-bold">{operator.towers}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Traffic Hotspots */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-orange-500" />
                Traffic Hotspots
              </h3>

              <div className="space-y-3">
                {hotspots.map((hotspot, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      hotspot.severity === 'high' ? 'bg-red-50 border-red-500' :
                      hotspot.severity === 'medium' ? 'bg-yellow-50 border-yellow-500' :
                      'bg-green-50 border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold">{hotspot.location}</h4>
                        <p className="text-sm text-gray-600 mt-1">{hotspot.actionTaken}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold">{hotspot.deviceCount.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Devices</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* How It Works */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">How It Works</h3>

              <div className="space-y-4 text-sm">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <div className="font-semibold">Device Tracking</div>
                    <div className="text-xs opacity-90">Every mobile device registered with nearby cell tower</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <div className="font-semibold">Subscriber Count</div>
                    <div className="text-xs opacity-90">Telecom operators provide number of subscribers</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <div className="font-semibold">Data Aggregation</div>
                    <div className="text-xs opacity-90">Collect data from multiple operators</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <div className="font-semibold">Density Calculation</div>
                    <div className="text-xs opacity-90">Analyze data to determine crowd in area</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sadhu Movement Tracking */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUsers className="text-orange-500" />
                Sadhu Movements
              </h3>

              <div className="space-y-3">
                {sadhuMovements.map((movement, index) => (
                  <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="font-bold text-sm">{movement.group}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      {movement.count.toLocaleString()} members
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <span className="font-semibold">{movement.currentLocation}</span>
                      <span>→</span>
                      <span className="font-semibold">{movement.destination}</span>
                    </div>
                    <div className="text-xs text-orange-600 mt-1">ETA: {movement.eta}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaChartLine className="text-green-500" />
                Impact Created
              </h3>

              <div className="space-y-3">
                {impactStats.map((stat, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4">Actions</h3>

              <div className="space-y-2">
                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                  <FaRoute />
                  Plan Alternate Route
                </button>
                <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition flex items-center justify-center gap-2">
                  <FaDownload />
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdSteeringMobile;
