import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaHome, FaMap, FaRoute, FaChartLine, FaVideo, FaInfoCircle, FaSignOutAlt } from 'react-icons/fa';
import LanguageSwitcher from './LanguageSwitcher';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { t } = useTranslation();
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const navItems = [
    { name: t('nav.home'), path: '/', icon: <FaHome /> },
    { name: t('nav.heatmap'), path: '/heatmap', icon: <FaMap /> },
    { name: t('nav.safeRoute'), path: '/safe-route', icon: <FaRoute /> },
    { name: t('nav.predictions'), path: '/prediction', icon: <FaChartLine /> },
    { name: t('nav.liveVideo'), path: '/live-feed', icon: <FaVideo /> },
    { name: 'Kumbh Info', path: '/kumbh-info', icon: <FaInfoCircle /> },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-saffron-500 to-spiritual-green rounded-full flex items-center justify-center shadow-lg"
            >
              <span className="text-white font-bold text-xl">कुं</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold gradient-text">Kumbh Mela</span>
              <span className="text-xs text-gray-600">Crowd Management</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link key={index} to={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg hover:bg-gradient-to-r hover:from-saffron-500 hover:to-spiritual-green hover:text-white transition-all duration-300 flex items-center space-x-2 group"
                >
                  <span className="text-lg group-hover:text-white">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 hover:text-saffron-600 focus:outline-none"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden pb-4"
          >
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-saffron-500 hover:to-spiritual-green hover:text-white transition-all duration-300 flex items-center space-x-3 my-1"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center space-x-3 my-1"
            >
              <FaSignOutAlt />
              <span className="font-medium">Logout</span>
            </button>
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
