import React from 'react';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaUsers, FaMapMarkedAlt, FaBrain } from 'react-icons/fa';

const Hero = () => {
  const features = [
    {
      icon: <FaMapMarkedAlt className="text-4xl" />,
      title: 'Live Heatmap',
      description: 'Real-time crowd density monitoring'
    },
    {
      icon: <FaShieldAlt className="text-4xl" />,
      title: 'Safe Routes',
      description: 'AI-powered route suggestions'
    },
    {
      icon: <FaUsers className="text-4xl" />,
      title: 'Crowd Detection',
      description: 'YOLO-based people counting'
    },
    {
      icon: <FaBrain className="text-4xl" />,
      title: 'Predictions',
      description: 'Future crowd density forecasts'
    }
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-saffron-50 via-white to-green-50 pt-16 pb-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-saffron-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Kumbh Mela</span>
              <br />
              <span className="text-gray-800">Crowd Management</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
              Experience the future of crowd safety with AI-powered monitoring, 
              real-time analytics, and intelligent route planning for the world's 
              largest religious gathering.
            </p>
            
            {/* Four Sacred Locations Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8 inline-block"
            >
              <div className="bg-gradient-to-r from-orange-500 via-white to-green-600 p-1 rounded-full">
                <div className="bg-white px-6 py-3 rounded-full">
                  <p className="text-sm font-semibold text-gray-700">
                    🕉️ Monitoring All 4 Sacred Locations: 
                    <span className="text-orange-600 ml-2">Prayagraj</span>
                    <span className="mx-1">•</span>
                    <span className="text-blue-600">Haridwar</span>
                    <span className="mx-1">•</span>
                    <span className="text-green-600">Nashik</span>
                    <span className="mx-1">•</span>
                    <span className="text-purple-600">Ujjain</span>
                  </p>
                </div>
              </div>
            </motion.div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View Live Dashboard
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white text-saffron-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl border-2 border-saffron-500 transition-all duration-300"
              >
                Emergency Alert
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="text-saffron-600 mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { value: '150M+', label: 'Expected Visitors' },
            { value: '24/7', label: 'Monitoring' },
            { value: '99.9%', label: 'Accuracy' },
            { value: '<1s', label: 'Response Time' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
