import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaExclamationTriangle, FaInfoCircle, FaBullhorn } from 'react-icons/fa';

const EmergencyAlert = ({ alerts, onClose }) => {
  const getAlertStyle = (type) => {
    switch (type) {
      case 'critical':
        return 'bg-red-600 border-red-700';
      case 'warning':
        return 'bg-orange-600 border-orange-700';
      case 'info':
        return 'bg-blue-600 border-blue-700';
      default:
        return 'bg-yellow-600 border-yellow-700';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical':
      case 'warning':
        return <FaExclamationTriangle className="text-2xl" />;
      case 'info':
        return <FaInfoCircle className="text-2xl" />;
      default:
        return <FaBullhorn className="text-2xl" />;
    }
  };

  return (
    <div className="fixed top-20 left-0 right-0 z-40 px-4">
      <AnimatePresence>
        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id || index}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            className={`max-w-4xl mx-auto mb-3 rounded-lg shadow-2xl border-2 ${getAlertStyle(alert.type)} text-white p-4 animate-pulse-alert`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="animate-pulse">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">
                    {alert.title || 'Emergency Alert'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {alert.message || alert.text}
                  </p>
                  {alert.location && (
                    <p className="text-xs mt-1 opacity-75">
                      Location: {alert.location}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onClose(alert.id || index)}
                className="ml-4 hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
              >
                <FaTimes />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default EmergencyAlert;
