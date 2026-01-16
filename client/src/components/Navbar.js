import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaHome, FaMap, FaRoute, FaChartLine, FaVideo, FaInfoCircle, FaSignOutAlt, FaBell, FaUserCircle, FaHeart, FaFirstAid, FaHospital, FaMapMarkedAlt, FaCube } from 'react-icons/fa';
import { GiIndianPalace } from 'react-icons/gi';
import LanguageSwitcher from './LanguageSwitcher';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { t } = useTranslation();
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: t('nav.home'), path: '/', icon: <FaHome />, badge: null },
    { name: t('nav.heatmap'), path: '/heatmap', icon: <FaMap />, badge: null },
    { name: t('nav.safeRoute'), path: '/safe-route', icon: <FaRoute />, badge: null },
    { name: t('nav.predictions'), path: '/prediction', icon: <FaChartLine />, badge: null },
    { name: t('nav.liveVideo'), path: '/live-feed', icon: <FaVideo />, badge: 'Live' },
    { name: 'Kumbh Info', path: '/kumbh-info', icon: <FaInfoCircle />, badge: null },
    { name: '🏥 Medi-Tracker', path: '/medi-tracker', icon: <FaHospital />, badge: null },
    { name: '🗺️ Track Nashik', path: '/track-nashik', icon: <FaMapMarkedAlt />, badge: null },
    { name: '🏗️ 3D Maps', path: '/maps-3d', icon: <FaCube />, badge: null },
    { name: '🦠 Epimetrics', path: '/epimetrics', icon: <FaFirstAid />, badge: 'New' },
    { name: '👣 Ashioto', path: '/ashioto', icon: <FaMap />, badge: 'New' },
    { name: '🍲 Annadan', path: '/annadan', icon: <FaHeart />, badge: 'New' },
  ];

  const quickActions = [
    { name: 'Lost & Found', path: '/lost-found', icon: <FaHeart />, color: 'text-pink-500' },
    { name: 'Medical', path: '/medical', icon: <FaFirstAid />, color: 'text-red-500' },
    { name: 'Medi-Tracker', path: '/medi-tracker', icon: <FaHospital />, color: 'text-blue-500' },
    { name: 'Track Routes', path: '/track-nashik', icon: <FaMapMarkedAlt />, color: 'text-purple-500' },
  ];

  const mockNotifications = [
    { id: 1, message: 'High crowd density at Sangam Nose', type: 'warning', time: '2 min ago' },
    { id: 2, message: 'Route B cleared for movement', type: 'success', time: '5 min ago' },
    { id: 3, message: 'Weather alert: Rain expected', type: 'info', time: '10 min ago' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/98 backdrop-blur-xl shadow-2xl' 
          : 'bg-white/95 backdrop-blur-lg shadow-lg'
      }`}
    >
      {/* Top gradient border */}
      <div className="h-1 bg-gradient-to-r from-orange-500 via-saffron-600 to-spiritual-green"></div>
      
      <div className="max-w-full mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section - Aligned to the left */}
          <Link to="/" className="flex items-center space-x-3 group -ml-2">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.05 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-spiritual-green rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-shadow">
                <GiIndianPalace className="text-white text-2xl" />
              </div>
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

          {/* Desktop Navigation - More spacing */}
          <div className="hidden lg:flex items-center space-x-3">
            {navItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2.5 rounded-lg transition-all duration-300 flex items-center space-x-2 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-orange-500 to-spiritual-green text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-lg ${isActive(item.path) ? 'text-white' : 'text-gray-600'}`}>
                    {item.icon}
                  </span>
                  <span className={`font-medium text-sm ${isActive(item.path) ? 'text-white' : 'text-gray-700'}`}>
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="ml-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="flex items-center space-x-3 mr-2">
              {quickActions.map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => navigate(action.path)}
                  className="p-2.5 rounded-lg bg-gray-100 hover:bg-gradient-to-br hover:from-orange-100 hover:to-green-100 transition-all duration-300"
                  title={action.name}
                >
                  <span className={`text-lg ${action.color}`}>{action.icon}</span>
                </motion.button>
              ))}
            </div>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300"
              >
                <FaBell className="text-lg text-gray-700" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  3
                </span>
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowNotifications(false)}
                    ></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 z-20"
                    >
                      <div className="bg-gradient-to-r from-orange-500 to-spiritual-green p-3">
                        <h3 className="text-white font-bold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {mockNotifications.map((notif) => (
                          <div key={notif.id} className="p-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer transition-colors">
                            <div className="flex items-start space-x-2">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                notif.type === 'warning' ? 'bg-yellow-500' : 
                                notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                              }`}></div>
                              <div className="flex-1">
                                <p className="text-xs text-gray-800 font-medium">{notif.message}</p>
                                <p className="text-[10px] text-gray-500 mt-0.5">{notif.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 bg-gray-50 text-center">
                        <button className="text-xs text-orange-600 font-semibold hover:text-orange-700">View All</button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher */}
            <div className="ml-2">
              <LanguageSwitcher />
            </div>

            {/* Profile Menu */}
            <div className="relative ml-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-spiritual-green text-white shadow-md hover:shadow-lg transition-all duration-300"
              >
                <FaUserCircle className="text-xl" />
                <span className="font-semibold text-sm hidden xl:block">Pilgrim</span>
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfileMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowProfileMenu(false)}
                    ></div>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 z-20"
                    >
                      <div className="p-4 bg-gradient-to-r from-orange-500 to-spiritual-green text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                            <FaUserCircle className="text-2xl" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{user?.name || 'Pilgrim'}</p>
                            <p className="text-[10px] text-white/90">{user?.email || 'user@kumbhmela.com'}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/profile');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
                        >
                          <FaUserCircle className="text-gray-600 text-sm" />
                          <span className="text-gray-700 font-medium text-sm">My Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            navigate('/');
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center space-x-2"
                        >
                          <FaHome className="text-gray-600 text-sm" />
                          <span className="text-gray-700 font-medium text-sm">Dashboard</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2 text-red-600"
                        >
                          <FaSignOutAlt className="text-sm" />
                          <span className="font-medium text-sm">Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <LanguageSwitcher />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-spiritual-green text-white shadow-md"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 space-y-1"
            >
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-orange-500 to-spiritual-green text-white shadow-md'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className={`text-lg ${isActive(item.path) ? 'text-white' : 'text-gray-700'}`}>
                      {item.icon}
                    </span>
                    <span className={`font-semibold ${isActive(item.path) ? 'text-white' : 'text-gray-700'}`}>
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </motion.div>
                </Link>
              ))}
              
              {/* Quick Actions Mobile */}
              <div className="pt-2 border-t border-gray-200 space-y-1">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: (navItems.length + index) * 0.05 }}
                    onClick={() => {
                      navigate(action.path);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all duration-300 flex items-center space-x-3"
                  >
                    <span className={`text-lg ${action.color}`}>{action.icon}</span>
                    <span className="font-semibold text-gray-700">{action.name}</span>
                  </motion.button>
                ))}
              </div>

              {/* Profile & Logout Mobile */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (navItems.length + quickActions.length) * 0.05 }}
                className="pt-2 border-t border-gray-200"
              >
                <div className="px-4 py-3 bg-gradient-to-r from-orange-100 to-green-100 rounded-lg mb-2">
                  <div className="flex items-center space-x-3">
                    <FaUserCircle className="text-2xl text-orange-600" />
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{user?.name || 'Pilgrim'}</p>
                      <p className="text-xs text-gray-600">{user?.email || 'user@kumbhmela.com'}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-md"
                >
                  <FaSignOutAlt />
                  <span className="font-bold">Logout</span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
