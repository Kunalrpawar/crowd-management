import React, { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUserCircle, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaEdit, 
  FaSave,
  FaTimes,
  FaCalendar,
  FaIdCard,
  FaLanguage
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import Navbar from './Navbar';
import axios from 'axios';

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    locationsVisited: 5,
    eventsAttended: 3,
    daysSinceRegistration: 12
  });
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Pilgrim User',
    email: user?.email || 'user@kumbhmela.com',
    phone: user?.phone || '+91 98765 43210',
    address: user?.address || 'Nashik, Maharashtra',
    language: user?.language || 'English',
    registrationDate: user?.registrationDate 
      ? new Date(user.registrationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'January 1, 2026',
    pilgrimId: user?.pilgrimId || 'KM2026-' + Math.random().toString(36).substr(2, 6).toUpperCase()
  });

  const [editData, setEditData] = useState({ ...profileData });

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserProfile = async () => {
    if (!user?.id) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}`);
      if (response.data.success) {
        const userData = response.data.data;
        const formattedData = {
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '+91 98765 43210',
          address: userData.address || 'Nashik, Maharashtra',
          language: userData.language || 'English',
          registrationDate: new Date(userData.registrationDate).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          pilgrimId: userData.pilgrimId
        };
        setProfileData(formattedData);
        setEditData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserStats = async () => {
    if (!user?.id) return;
    
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user.id}/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = async () => {
    if (!user?.id) {
      alert('User not found. Please log in again.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put(`http://localhost:5000/api/users/${user.id}`, {
        name: editData.name,
        phone: editData.phone,
        address: editData.address,
        language: editData.language
      });

      if (response.data.success) {
        setProfileData({ ...editData });
        setIsEditing(false);
        
        // Update user context
        if (setUser) {
          setUser({ ...user, ...response.data.data });
        }
        
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-spiritual-green text-white rounded-t-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30 backdrop-blur-sm"
                >
                  <FaUserCircle className="text-6xl text-white" />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{profileData.name}</h1>
                  <p className="text-white/90 flex items-center space-x-2">
                    <FaIdCard />
                    <span>{profileData.pilgrimId}</span>
                  </p>
                </div>
              </div>
              {!isEditing && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleEdit}
                  className="bg-white text-orange-600 px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all"
                >
                  <FaEdit />
                  <span>Edit Profile</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-white rounded-b-2xl shadow-xl p-8">
            {/* Action Buttons (when editing) */}
            {isEditing && (
              <div className="flex justify-end space-x-3 mb-6 pb-6 border-b border-gray-200">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancel}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:bg-gray-300 transition-all"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-gradient-to-r from-orange-500 to-spiritual-green text-white px-6 py-2 rounded-xl font-semibold flex items-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50"
                >
                  <FaSave />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </motion.button>
              </div>
            )}

            {/* Profile Fields */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-600 font-semibold">
                  <FaUserCircle className="text-orange-500" />
                  <span>Full Name</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                  />
                ) : (
                  <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
                    {profileData.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-600 font-semibold">
                  <FaEnvelope className="text-orange-500" />
                  <span>Email Address</span>
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                  />
                ) : (
                  <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
                    {profileData.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-600 font-semibold">
                  <FaPhone className="text-orange-500" />
                  <span>Phone Number</span>
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                  />
                ) : (
                  <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
                    {profileData.phone}
                  </p>
                )}
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-600 font-semibold">
                  <FaMapMarkerAlt className="text-orange-500" />
                  <span>Address</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                  />
                ) : (
                  <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
                    {profileData.address}
                  </p>
                )}
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-600 font-semibold">
                  <FaLanguage className="text-orange-500" />
                  <span>Preferred Language</span>
                </label>
                {isEditing ? (
                  <select
                    value={editData.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-orange-200 rounded-xl focus:border-orange-500 focus:outline-none transition-all"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिंदी (Hindi)</option>
                    <option value="Marathi">मराठी (Marathi)</option>
                    <option value="Bengali">বাংলা (Bengali)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Telugu">తెలుగు (Telugu)</option>
                  </select>
                ) : (
                  <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
                    {profileData.language}
                  </p>
                )}
              </div>

              {/* Registration Date (Read-only) */}
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-gray-600 font-semibold">
                  <FaCalendar className="text-orange-500" />
                  <span>Registration Date</span>
                </label>
                <p className="text-lg text-gray-800 bg-gray-50 px-4 py-3 rounded-xl">
                  {profileData.registrationDate}
                </p>
              </div>
            </div>

            {/* Statistics Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Your Kumbh Mela Journey</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-orange-100 to-orange-50 p-6 rounded-xl text-center"
                >
                  <p className="text-3xl font-bold text-orange-600">{stats.locationsVisited}</p>
                  <p className="text-gray-600 mt-2">Locations Visited</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-green-100 to-green-50 p-6 rounded-xl text-center"
                >
                  <p className="text-3xl font-bold text-spiritual-green">{stats.eventsAttended}</p>
                  <p className="text-gray-600 mt-2">Events Attended</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-gradient-to-r from-blue-100 to-blue-50 p-6 rounded-xl text-center"
                >
                  <p className="text-3xl font-bold text-blue-600">{stats.daysSinceRegistration}</p>
                  <p className="text-gray-600 mt-2">Days at Kumbh</p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
