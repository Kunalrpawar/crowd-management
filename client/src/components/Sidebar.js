import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FaBars, FaTimes, FaHome, FaMap, FaRoute, FaChartLine, FaVideo, 
  FaInfoCircle, FaSignOutAlt, FaUserCircle, FaHeart, FaFirstAid, 
  FaHospital, FaMapMarkedAlt, FaCube, FaChevronDown, FaChevronUp, FaParking
} from 'react-icons/fa';
import { GiIndianPalace } from 'react-icons/gi';
import LanguageSwitcher from './LanguageSwitcher';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Sidebar = () => {
  const { t } = useTranslation();
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    features: true,
    monitoring: true
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const mainNavItems = [
    { name: t('nav.home'), path: '/', icon: <FaHome />, badge: null },
    { name: 'Kumbh Info', path: '/kumbh-info', icon: <FaInfoCircle />, badge: null },
  ];

  const monitoringItems = [
    { name: t('nav.heatmap'), path: '/heatmap', icon: <FaMap />, badge: null },
    { name: t('nav.safeRoute'), path: '/safe-route', icon: <FaRoute />, badge: null },
    { name: t('nav.predictions'), path: '/prediction', icon: <FaChartLine />, badge: null },
    { name: t('nav.liveVideo'), path: '/live-feed', icon: <FaVideo />, badge: null },
    { name: 'Track Nashik', path: '/track-nashik', icon: <FaMapMarkedAlt />, badge: null },
    { name: '3D Maps', path: '/maps-3d', icon: <FaCube />, badge: null },
    { name: 'Parking Availability', path: '/parking', icon: <FaParking />, badge: 'New' },
  ];

  const featureItems = [
    { name: 'Epimetrics', path: '/epimetrics', icon: <FaFirstAid />, badge: 'New', emoji: '🦠' },
    { name: 'Ashioto', path: '/ashioto', icon: <FaMap />, badge: 'New', emoji: '👣' },
    { name: 'Annadan', path: '/annadan', icon: <FaHeart />, badge: 'New', emoji: '🍲' },
    { name: 'Mobile Crowd Steering', path: '/crowd-steering-mobile', icon: <FaMapMarkedAlt />, badge: 'New', emoji: '📱' },
    { name: 'Medi-Tracker', path: '/medi-tracker', icon: <FaHospital />, badge: null, emoji: '🏥' },
    { name: 'Lost & Found', path: '/lost-found', icon: <FaHeart />, badge: null, emoji: '💝' },
    { name: 'Medical Emergency', path: '/medical', icon: <FaFirstAid />, badge: null, emoji: '🚑' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Toggle Button - Always visible */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 w-12 h-12 bg-gradient-to-br from-orange-500 to-spiritual-green rounded-xl shadow-lg flex items-center justify-center text-white hover:shadow-2xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay for mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            {/* Sidebar Panel */}
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-80 bg-white shadow-2xl z-40 overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <Link to="/" className="flex items-center space-x-3 group" onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-br from-orange-500 to-spiritual-green rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <GiIndianPalace className="text-white text-2xl" />
                  </motion.div>
                  <div className="flex flex-col">
                    <span className="text-xl font-extrabold bg-gradient-to-r from-orange-600 to-green-600 bg-clip-text text-transparent">
                      Kumbh Mela
                    </span>
                    <span className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
                      Crowd Management
                    </span>
                  </div>
                </Link>
              </div>

              {/* User Profile */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-orange-50 to-green-50 rounded-lg">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-green-400 rounded-full flex items-center justify-center">
                    <FaUserCircle className="text-white text-xl" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 text-sm">{user?.name || 'Admin User'}</div>
                    <div className="text-xs text-gray-500">{user?.role || 'Administrator'}</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4 space-y-2">
                {/* Main Navigation */}
                <div className="space-y-1">
                  {mainNavItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-orange-500 to-green-500 text-white shadow-lg'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>

                {/* Monitoring Section */}
                <div className="pt-4">
                  <button
                    onClick={() => toggleSection('monitoring')}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-bold text-gray-600 uppercase tracking-wider hover:text-orange-600 transition"
                  >
                    <span>📊 Monitoring</span>
                    {expandedSections.monitoring ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.monitoring && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1 mt-2 overflow-hidden"
                      >
                        {monitoringItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                              isActive(item.path)
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-base">{item.icon}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.badge && (
                              <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${
                                item.badge === 'Live' 
                                  ? 'bg-red-500 text-white animate-pulse' 
                                  : 'bg-green-500 text-white'
                              }`}>
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Special Features Section */}
                <div className="pt-4">
                  <button
                    onClick={() => toggleSection('features')}
                    className="flex items-center justify-between w-full px-4 py-2 text-sm font-bold text-gray-600 uppercase tracking-wider hover:text-orange-600 transition"
                  >
                    <span>⭐ Special Features</span>
                    {expandedSections.features ? <FaChevronUp /> : <FaChevronDown />}
                  </button>
                  
                  <AnimatePresence>
                    {expandedSections.features && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-1 mt-2 overflow-hidden"
                      >
                        {featureItems.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all ${
                              isActive(item.path)
                                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span className="text-base">{item.emoji}</span>
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.badge && (
                              <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-green-500 text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Language Switcher */}
                <div className="pt-4">
                  <LanguageSwitcher />
                </div>

                {/* Logout Button */}
                <div className="pt-4 pb-20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-semibold hover:from-red-600 hover:to-pink-600 transition shadow-lg"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
