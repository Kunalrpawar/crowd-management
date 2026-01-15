import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaVirus, FaHospital, FaUserMd, FaExclamationTriangle, 
  FaMapMarkerAlt, FaPills, FaChartLine, FaWater,
  FaSearch, FaBell, FaDownload
} from 'react-icons/fa';

const Epimetrics = () => {
  const [selectedDisease, setSelectedDisease] = useState('all');
  const [patients, setPatients] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [doctorStats, setDoctorStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const statsData = {
    totalPatients: 24000,
    trainedDoctors: 3600,
    activeAlerts: 12,
    locationsMonitored: 45
  };

  const diseaseData = [
    {
      id: 1,
      name: 'Jaundice',
      cases: 156,
      trend: 'up',
      location: 'Solapur',
      date: '21-29 Aug 2019',
      severity: 'high',
      color: '#FF6B6B',
      description: 'NMC Market water pollution related cases',
      medicines: ['Liv-52', 'Urso 300', 'Silymarin'],
      intervention: 'Water quality testing initiated'
    },
    {
      id: 2,
      name: 'Diarrhea',
      cases: 342,
      trend: 'down',
      location: 'Multiple Kumbh Locations',
      date: 'Ongoing',
      severity: 'medium',
      color: '#FFD93D',
      description: 'Multiple outbreak points identified',
      medicines: ['ORS', 'Zinc Sulfate', 'Azithromycin'],
      intervention: 'Sanitation drives activated'
    },
    {
      id: 3,
      name: 'Typhoid',
      cases: 89,
      trend: 'stable',
      location: 'Nashik',
      date: 'Jan 2026',
      severity: 'low',
      color: '#4ECDC4',
      description: 'Early detection through water monitoring',
      medicines: ['Azithromycin', 'Ciprofloxacin'],
      intervention: 'Preventive vaccination campaign'
    },
    {
      id: 4,
      name: 'Cholera',
      cases: 23,
      trend: 'down',
      location: 'Prayagraj',
      date: 'Jan 2026',
      severity: 'medium',
      color: '#FF8B94',
      description: 'Controlled outbreak near riverbank',
      medicines: ['Doxycycline', 'ORS', 'IV Fluids'],
      intervention: 'Emergency water treatment deployed'
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: 'outbreak',
      disease: 'Diarrhea',
      location: 'Nashik Zone 3',
      timestamp: '2 hours ago',
      severity: 'high',
      action: 'Immediate intervention required'
    },
    {
      id: 2,
      type: 'medicine',
      disease: 'Jaundice',
      location: 'Solapur District',
      timestamp: '5 hours ago',
      severity: 'medium',
      action: 'Stock ORS and Zinc supplements'
    },
    {
      id: 3,
      type: 'water',
      disease: 'Water Pollution',
      location: 'NMC Market',
      timestamp: '1 day ago',
      severity: 'high',
      action: 'Water supply shut down for testing'
    }
  ];

  const locationData = [
    { name: 'Nashik', lat: 19.9975, lng: 73.7898, cases: 567, doctors: 850 },
    { name: 'Prayagraj', lat: 25.4358, lng: 81.8463, cases: 892, doctors: 1200 },
    { name: 'Haridwar', lat: 29.9457, lng: 78.1642, cases: 423, doctors: 680 },
    { name: 'Ujjain', lat: 23.1765, lng: 75.7885, cases: 334, doctors: 550 },
    { name: 'Solapur', lat: 17.6599, lng: 75.9064, cases: 234, doctors: 320 }
  ];

  const achievements = [
    {
      icon: '👥',
      count: '24,000+',
      label: 'Patients Analyzed',
      color: 'blue'
    },
    {
      icon: '👨‍⚕️',
      count: '3,600',
      label: 'Doctors Trained',
      color: 'green'
    },
    {
      icon: '💧',
      count: '100%',
      label: 'Water Pollution Prevented',
      color: 'cyan'
    },
    {
      icon: '🎯',
      count: '45+',
      label: 'Locations Monitored',
      color: 'purple'
    }
  ];

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update would happen here
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-500',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-500',
      low: 'bg-green-100 text-green-800 border-green-500'
    };
    return colors[severity] || colors.low;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return '📈';
    if (trend === 'down') return '📉';
    return '➡️';
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
            <FaVirus className="text-purple-600" />
            Epimetrics - Disease Monitoring
          </h1>
          <p className="text-xl text-gray-600">
            Real-time disease surveillance and outbreak prediction system
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              🔬 Real-time Analytics
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              🎯 Geo-targeted Interventions
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              💊 Medicine Alerts
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              📊 Outbreak Prediction
            </span>
          </div>
        </motion.div>

        {/* Achievements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {achievements.map((achievement, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white rounded-xl p-6 shadow-lg text-center border-t-4 border-${achievement.color}-500`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <div className="text-3xl font-bold text-gray-800">{achievement.count}</div>
              <div className="text-sm text-gray-600">{achievement.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search diseases, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedDisease}
            onChange={(e) => setSelectedDisease(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Diseases</option>
            <option value="jaundice">Jaundice</option>
            <option value="diarrhea">Diarrhea</option>
            <option value="typhoid">Typhoid</option>
            <option value="cholera">Cholera</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Disease Outbreaks */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaChartLine className="text-purple-600" />
              Active Disease Monitoring
            </h2>

            {diseaseData.map((disease) => (
              <motion.div
                key={disease.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-xl shadow-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold flex items-center gap-2">
                      <span style={{ color: disease.color }}>●</span>
                      {disease.name}
                      <span className="text-2xl">{getTrendIcon(disease.trend)}</span>
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">{disease.description}</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg border-l-4 ${getSeverityColor(disease.severity)}`}>
                    <div className="text-2xl font-bold">{disease.cases}</div>
                    <div className="text-xs">Cases</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <span className="text-sm">
                      <strong>Location:</strong> {disease.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBell className="text-orange-500" />
                    <span className="text-sm">
                      <strong>Date:</strong> {disease.date}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <FaPills className="text-blue-500" />
                    Recommended Medicines:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {disease.medicines.map((med, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                      >
                        {med}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-500">
                  <strong className="text-sm">Intervention:</strong>
                  <p className="text-sm text-gray-700 mt-1">{disease.intervention}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Alerts and Locations */}
          <div className="space-y-6">
            {/* Recent Alerts */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-orange-500" />
                Recent Alerts
              </h3>

              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                  >
                    <div className="font-semibold text-sm">{alert.disease}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      <FaMapMarkerAlt className="inline mr-1" />
                      {alert.location}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{alert.timestamp}</div>
                    <div className="text-xs font-medium mt-2 text-gray-700">
                      ⚡ {alert.action}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center gap-2">
                <FaBell />
                View All Alerts
              </button>
            </div>

            {/* Monitored Locations */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                Monitored Locations
              </h3>

              <div className="space-y-3">
                {locationData.map((location, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold">{location.name}</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {location.cases} cases • {location.doctors} doctors
                        </div>
                      </div>
                      <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Active
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Water Quality */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaWater className="text-cyan-500" />
                Water Quality
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                  <div className="font-semibold text-sm">Nashik NMC</div>
                  <div className="text-xs text-gray-600 mt-1">
                    ✅ Pollution Prevented
                  </div>
                  <div className="text-xs text-green-700 mt-2">
                    Water quality: Excellent
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                  <div className="font-semibold text-sm">Solapur Market</div>
                  <div className="text-xs text-gray-600 mt-1">
                    ⚠️ Under Monitoring
                  </div>
                  <div className="text-xs text-yellow-700 mt-2">
                    Water quality: Fair
                  </div>
                </div>
              </div>
            </div>

            {/* Export Data */}
            <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 shadow-lg">
              <FaDownload />
              Export Analytics Report
            </button>
          </div>
        </div>

        {/* Team Section */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Epimetrics Team</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Pratik Khandeqale', role: 'BE-CS, Big Data' },
              { name: 'Ayush', role: 'Developer' },
              { name: 'Tejashree Singh Kale', role: 'BE-CS, BA/ML, MBA' },
              { name: 'Inakar Chaudal', role: 'BE-CS, Consultant' },
              { name: 'Kishoo Kothaliya', role: 'Android Dev' },
              { name: 'Ajit Chavan', role: 'M.CS, Networking' }
            ].map((member, idx) => (
              <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-3xl mb-2">👤</div>
                <div className="font-semibold text-sm">{member.name}</div>
                <div className="text-xs text-gray-600">{member.role}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Epimetrics;
