import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUsers, FaExclamationTriangle, FaCheckCircle, FaClock, FaSearch, FaAmbulance, FaCloudSun } from 'react-icons/fa';
import { SocketContext } from '../context/SocketContext';

const Dashboard = ({ crowdData }) => {
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stats, setStats] = useState({
    totalPeople: 0,
    dangerZones: 0,
    safeZones: 0,
    averageWaitTime: 0
  });

  const [recentUpdates, setRecentUpdates] = useState([
    { time: '2 mins ago', message: 'Crowd density increased at Zone A', type: 'warning' },
    { time: '5 mins ago', message: 'Route B cleared for movement', type: 'success' },
    { time: '10 mins ago', message: 'Emergency alert resolved at Zone C', type: 'info' }
  ]);

  useEffect(() => {
    if (crowdData) {
      setStats({
        totalPeople: crowdData.totalPeople || 0,
        dangerZones: crowdData.dangerZones || 0,
        safeZones: crowdData.safeZones || 0,
        averageWaitTime: crowdData.averageWaitTime || 0
      });
    } else {
      // Simulate data for demo
      const simulateData = () => {
        setStats({
          totalPeople: Math.floor(Math.random() * 50000) + 100000,
          dangerZones: Math.floor(Math.random() * 5) + 1,
          safeZones: Math.floor(Math.random() * 15) + 10,
          averageWaitTime: Math.floor(Math.random() * 20) + 5
        });
      };

      simulateData();
      const interval = setInterval(simulateData, 5000);
      return () => clearInterval(interval);
    }
  }, [crowdData]);

  const statCards = [
    {
      icon: <FaUsers className="text-4xl" />,
      title: 'Total People',
      value: stats.totalPeople.toLocaleString(),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: <FaExclamationTriangle className="text-4xl" />,
      title: 'Danger Zones',
      value: stats.dangerZones,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      icon: <FaCheckCircle className="text-4xl" />,
      title: 'Safe Zones',
      value: stats.safeZones,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      icon: <FaClock className="text-4xl" />,
      title: 'Avg Wait Time',
      value: `${stats.averageWaitTime} min`,
      color: 'from-saffron-500 to-saffron-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-saffron-600'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-center mb-12 gradient-text">
          Live Dashboard
        </h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statCards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className={`${card.iconColor} mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-2">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-800">{card.value}</p>
              <div className={`mt-3 h-1 rounded-full bg-gradient-to-r ${card.color}`}></div>
            </motion.div>
          ))}
        </div>

        {/* Recent Updates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Recent Updates</h3>
          <div className="space-y-4">
            {recentUpdates.map((update, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <div className={`w-2 h-2 mt-2 rounded-full ${
                  update.type === 'warning' ? 'bg-yellow-500' :
                  update.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{update.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{update.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Access Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lost & Found Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 shadow-xl cursor-pointer"
              onClick={() => navigate('/lost-found')}
            >
              <div className="text-white">
                <FaSearch className="text-5xl mb-4" />
                <h4 className="text-2xl font-bold mb-2">{t('nav.lostFound')}</h4>
                <p className="text-white/90 text-sm">
                  Report missing persons or found individuals. Help reunite families.
                </p>
                <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <span className="font-semibold">Click to Access →</span>
                </div>
              </div>
            </motion.div>

            {/* Medical Emergency Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-red-600 to-pink-600 rounded-2xl p-6 shadow-xl cursor-pointer"
              onClick={() => navigate('/medical')}
            >
              <div className="text-white">
                <FaAmbulance className="text-5xl mb-4" />
                <h4 className="text-2xl font-bold mb-2">{t('nav.medical')}</h4>
                <p className="text-white/90 text-sm">
                  Emergency medical assistance. Ambulance dispatch and facility locator.
                </p>
                <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <span className="font-semibold">Helpline: 108 →</span>
                </div>
              </div>
            </motion.div>

            {/* Weather Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 shadow-xl cursor-pointer"
              onClick={() => navigate('/weather')}
            >
              <div className="text-white">
                <FaCloudSun className="text-5xl mb-4" />
                <h4 className="text-2xl font-bold mb-2">{t('nav.weather')}</h4>
                <p className="text-white/90 text-sm">
                  Real-time weather, forecasts, and best bathing times.
                </p>
                <div className="mt-4 inline-block bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm">
                  <span className="font-semibold">View Weather →</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
