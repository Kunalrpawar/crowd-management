import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaUtensils, FaHandHoldingHeart, FaMapMarkerAlt, FaUsers,
  FaHeart, FaTruck, FaChartLine, FaAward, FaLeaf, FaHandshake
} from 'react-icons/fa';

const Annadan = () => {
  const [selectedCenter, setSelectedCenter] = useState(null);

  // Distribution centers data
  const centers = [
    {
      id: 1,
      name: 'Nashik Central Kitchen',
      location: 'Nashik Road, Maharashtra',
      packetsDistributed: 2500,
      dailyCapacity: 500,
      womenEmployed: 15,
      status: 'active',
      ngoPartner: 'Akshaya Patra Foundation',
      lat: 19.9975,
      lng: 73.7898
    },
    {
      id: 2,
      name: 'Ramkund Distribution Hub',
      location: 'Ramkund Area, Nashik',
      packetsDistributed: 1800,
      dailyCapacity: 400,
      womenEmployed: 12,
      status: 'active',
      ngoPartner: 'Food Bank India',
      lat: 20.0063,
      lng: 73.7868
    },
    {
      id: 3,
      name: 'Panchavati Service Point',
      location: 'Panchavati, Nashik',
      packetsDistributed: 1500,
      dailyCapacity: 300,
      womenEmployed: 10,
      status: 'active',
      ngoPartner: 'Feeding India',
      lat: 20.0104,
      lng: 73.7685
    },
    {
      id: 4,
      name: 'Godavari Ghat Center',
      location: 'Godavari Riverbank',
      packetsDistributed: 1200,
      dailyCapacity: 250,
      womenEmployed: 13,
      status: 'active',
      ngoPartner: 'Robin Hood Army',
      lat: 19.9968,
      lng: 73.7912
    }
  ];

  const stats = {
    totalPackets: 7000,
    totalCenters: 4,
    womenEmployed: 50,
    ngoPartnerships: 3,
    mealsServed: 21000,
    wasteReduction: '85%'
  };

  const donors = [
    {
      id: 1,
      name: 'Taj Hotel Group',
      type: 'Hotels',
      contribution: '500 meals/day',
      icon: '🏨'
    },
    {
      id: 2,
      name: 'Local Weddings',
      type: 'Events',
      contribution: '200 meals/day',
      icon: '💒'
    },
    {
      id: 3,
      name: 'Corporate Offices',
      type: 'Corporates',
      contribution: '300 meals/day',
      icon: '🏢'
    },
    {
      id: 4,
      name: 'Restaurants',
      type: 'Food Business',
      contribution: '400 meals/day',
      icon: '🍽️'
    }
  ];

  const achievements = [
    { icon: '📦', count: '7,000+', label: 'Food Packets Distributed' },
    { icon: '🏪', count: '4', label: 'Distribution Centers' },
    { icon: '👩‍🍳', count: '50', label: 'Women Employed' },
    { icon: '🤝', count: '3', label: 'NGO Partnerships' },
    { icon: '🍽️', count: '21,000+', label: 'Total Meals Served' },
    { icon: '♻️', count: '85%', label: 'Food Waste Reduced' }
  ];

  const impactMetrics = [
    { metric: 'CO2 Saved', value: '12.5 tons', icon: '🌍' },
    { metric: 'Water Saved', value: '50,000 L', icon: '💧' },
    { metric: 'Lives Impacted', value: '15,000+', icon: '❤️' },
    { metric: 'Hunger Hours Reduced', value: '63,000', icon: '⏰' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 bg-clip-text text-transparent flex items-center justify-center gap-3">
            <FaUtensils className="text-orange-600" />
            Annadan - Food Distribution Platform
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            Connecting surplus food with those in need • Empowering women • Zero waste mission
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              🍲 Surplus Food Connection
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              👩‍🍳 Women Empowerment
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              ♻️ Zero Food Waste
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              🤝 NGO Collaboration
            </span>
          </div>
        </motion.div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-lg text-center hover:shadow-xl transition"
            >
              <div className="text-3xl mb-2">{achievement.icon}</div>
              <div className="text-2xl font-bold text-gray-800">{achievement.count}</div>
              <div className="text-xs text-gray-600 mt-1">{achievement.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Distribution Centers */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-red-500" />
                Distribution Centers
              </h3>

              <div className="space-y-4">
                {centers.map((center) => (
                  <motion.div
                    key={center.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => setSelectedCenter(selectedCenter === center.id ? null : center.id)}
                    className={`p-5 rounded-lg border-2 cursor-pointer transition ${
                      selectedCenter === center.id
                        ? 'border-orange-500 bg-orange-50'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-bold text-lg flex items-center gap-2">
                          {center.status === 'active' ? '🟢' : '🔴'} {center.name}
                        </h4>
                        <p className="text-sm text-gray-600">{center.location}</p>
                        <p className="text-xs text-purple-600 mt-1 flex items-center gap-1">
                          <FaHandshake /> Partner: {center.ngoPartner}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">
                          {center.packetsDistributed}
                        </div>
                        <div className="text-xs text-gray-600">packets today</div>
                      </div>
                    </div>

                    {selectedCenter === center.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t grid grid-cols-3 gap-3"
                      >
                        <div className="text-center p-3 bg-blue-50 rounded">
                          <div className="text-xl font-bold text-blue-600">
                            {center.dailyCapacity}
                          </div>
                          <div className="text-xs text-gray-600">Daily Capacity</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded">
                          <div className="text-xl font-bold text-green-600">
                            {center.womenEmployed}
                          </div>
                          <div className="text-xs text-gray-600">Women Staff</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded">
                          <div className="text-xl font-bold text-purple-600">
                            {((center.packetsDistributed / center.dailyCapacity) * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-600">Utilization</div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Food Donors */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaHandHoldingHeart className="text-pink-500" />
                Active Food Donors
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donors.map((donor) => (
                  <motion.div
                    key={donor.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg border border-orange-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">{donor.icon}</div>
                      <div>
                        <h4 className="font-bold text-gray-800">{donor.name}</h4>
                        <p className="text-xs text-gray-600">{donor.type}</p>
                      </div>
                    </div>
                    <div className="mt-2 pt-2 border-t border-orange-200">
                      <div className="text-sm font-semibold text-orange-600">
                        {donor.contribution}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200 text-center">
                <div className="text-2xl font-bold text-green-600">1,400+</div>
                <div className="text-sm text-gray-600">Total Daily Meal Contributions</div>
              </div>
            </div>

            {/* Supply Chain Process */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaTruck className="text-blue-500" />
                Supply Chain Process
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">Food Collection</h4>
                    <p className="text-sm text-gray-600">
                      Surplus food collected from hotels, events, and restaurants within 2 hours
                    </p>
                  </div>
                  <div className="text-2xl">🏨</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-600">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">Quality Check & Packaging</h4>
                    <p className="text-sm text-gray-600">
                      Women-led teams verify quality, repackage food in hygienic conditions
                    </p>
                  </div>
                  <div className="text-2xl">👩‍🍳</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center font-bold text-orange-600">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">Distribution</h4>
                    <p className="text-sm text-gray-600">
                      Food packets distributed through 4 strategic centers across Kumbh Mela
                    </p>
                  </div>
                  <div className="text-2xl">📦</div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center font-bold text-purple-600">
                    4
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">Impact Tracking</h4>
                    <p className="text-sm text-gray-600">
                      Real-time monitoring of meals served, waste reduction, and beneficiary feedback
                    </p>
                  </div>
                  <div className="text-2xl">📊</div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Women Empowerment */}
            <div className="bg-gradient-to-br from-pink-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaUsers />
                Women Empowerment
              </h3>

              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold">{stats.womenEmployed}</div>
                  <div className="text-sm opacity-90">Women Employed</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Fair wages & benefits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Skills training provided</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Safe work environment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>✅</span>
                    <span>Leadership opportunities</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="text-sm opacity-90">Average Monthly Income</div>
                  <div className="text-2xl font-bold">₹12,000</div>
                </div>
              </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaLeaf className="text-green-500" />
                Environmental Impact
              </h3>

              <div className="space-y-3">
                {impactMetrics.map((metric, index) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{metric.icon}</span>
                      <span className="text-sm text-gray-600">{metric.metric}</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{metric.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* NGO Partnerships */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaHandshake className="text-blue-500" />
                NGO Partners
              </h3>

              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-semibold">Akshaya Patra Foundation</div>
                  <div className="text-xs text-gray-600">Kitchen infrastructure</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-semibold">Feeding India</div>
                  <div className="text-xs text-gray-600">Distribution network</div>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-semibold">Robin Hood Army</div>
                  <div className="text-xs text-gray-600">Volunteer mobilization</div>
                </div>
              </div>
            </div>

            {/* Recognition */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaAward />
                Recognition
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <span>🏆</span>
                  <span>UN Sustainable Development Goal Award</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🌟</span>
                  <span>Best Social Impact Initiative 2024</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💫</span>
                  <span>Women Empowerment Excellence</span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl shadow-lg p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-3">Join Our Mission</h3>
              <p className="text-sm mb-4 opacity-90">
                Help us eliminate food waste and hunger at Kumbh Mela
              </p>
              <button className="w-full bg-white text-orange-600 font-bold py-3 rounded-lg hover:bg-orange-50 transition">
                Become a Donor
              </button>
              <button className="w-full mt-2 bg-orange-700 text-white font-bold py-3 rounded-lg hover:bg-orange-800 transition">
                Volunteer With Us
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FaChartLine className="text-green-500" />
            Real-Time Dashboard
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-3xl mb-2">📅</div>
              <div className="text-2xl font-bold text-blue-600">30</div>
              <div className="text-sm text-gray-600">Days Active</div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-3xl mb-2">⏱️</div>
              <div className="text-2xl font-bold text-green-600">2.5 hrs</div>
              <div className="text-sm text-gray-600">Avg Response Time</div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-3xl mb-2">😊</div>
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-gray-600">Satisfaction Rate</div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-3xl mb-2">♻️</div>
              <div className="text-2xl font-bold text-orange-600">85%</div>
              <div className="text-sm text-gray-600">Waste Reduction</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Annadan;
