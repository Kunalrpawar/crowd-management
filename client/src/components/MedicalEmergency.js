import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaAmbulance, FaHospital, FaPhone, FaMapMarkerAlt, FaBed, FaUserMd, FaExclamationTriangle } from 'react-icons/fa';

const MedicalEmergency = () => {
  const { t } = useTranslation();
  const [facilities, setFacilities] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [stats, setStats] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    condition: '',
    severity: 'medium',
    location: '',
    symptoms: '',
    contactNumber: ''
  });

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [facilitiesRes, statsRes, emergenciesRes] = await Promise.all([
        fetch('http://localhost:5000/api/medical/facilities'),
        fetch('http://localhost:5000/api/medical/stats'),
        fetch('http://localhost:5000/api/medical/emergencies')
      ]);

      const facilitiesData = await facilitiesRes.json();
      const statsData = await statsRes.json();
      const emergenciesData = await emergenciesRes.json();

      if (facilitiesData.success) setFacilities(facilitiesData.data);
      if (statsData.success) setStats(statsData.data);
      if (emergenciesData.success) setEmergencies(emergenciesData.data);
    } catch (error) {
      console.error('Error fetching medical data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/medical/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (data.success) {
        alert(t('medical.success'));
        setShowForm(false);
        setFormData({
          patientName: '',
          age: '',
          gender: '',
          condition: '',
          severity: 'medium',
          location: '',
          symptoms: '',
          contactNumber: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('Error submitting emergency:', error);
      alert(t('common.error'));
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-500';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-500';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-500';
      case 'low': return 'bg-green-100 text-green-800 border-green-500';
      default: return 'bg-gray-100 text-gray-800 border-gray-500';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'hospital': return '🏥';
      case 'emergency': return '🚨';
      case 'first-aid': return '⚕️';
      case 'pharmacy': return '💊';
      case 'trauma': return '🩺';
      case 'mobile': return '🚑';
      default: return '🏥';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-red-600 mb-2">
            {t('medical.title')}
          </h1>
          <p className="text-xl text-gray-600 font-semibold">
            {t('medical.helpline')}
          </p>
        </motion.div>

        {/* Emergency Button */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white text-xl font-bold py-4 px-8 rounded-full shadow-2xl transform transition-all hover:scale-105"
          >
            <FaExclamationTriangle className="inline mr-2" />
            {t('medical.requestHelp')}
          </button>
        </motion.div>

        {/* Emergency Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              {t('medical.requestHelp')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('medical.patientName')}
                  </label>
                  <input
                    type="text"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('lostFound.age')}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('lostFound.gender')}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="Male">{t('lostFound.male')}</option>
                    <option value="Female">{t('lostFound.female')}</option>
                    <option value="Other">{t('lostFound.other')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('medical.severity')} *
                  </label>
                  <select
                    required
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">{t('medical.low')}</option>
                    <option value="medium">{t('medical.medium')}</option>
                    <option value="high">{t('medical.high')}</option>
                    <option value="critical">{t('medical.critical')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('medical.condition')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.condition}
                  onChange={(e) => setFormData({...formData, condition: e.target.value})}
                  placeholder="e.g., Heart attack, Injury, Heat stroke"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('medical.symptoms')}
                </label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="inline mr-2" />
                  {t('medical.location')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="inline mr-2" />
                  {t('medical.contact')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  {t('common.submit')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                >
                  {t('common.cancel')}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <FaHospital className="text-4xl text-blue-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalFacilities || 0}</h3>
            <p className="text-gray-600">{t('medical.facilities')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <FaBed className="text-4xl text-green-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{stats.availableBeds || 0}</h3>
            <p className="text-gray-600">{t('medical.availableBeds')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <FaAmbulance className="text-4xl text-red-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{stats.availableAmbulances || 0}</h3>
            <p className="text-gray-600">{t('medical.ambulances')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 text-center"
          >
            <FaUserMd className="text-4xl text-purple-600 mx-auto mb-2" />
            <h3 className="text-2xl font-bold text-gray-800">{stats.totalDoctors || 0}</h3>
            <p className="text-gray-600">{t('medical.doctors')}</p>
          </motion.div>
        </div>

        {/* Medical Facilities */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t('medical.facilities')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facilities.map((facility) => (
              <motion.div
                key={facility.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-2xl mb-2">{getTypeIcon(facility.type)}</div>
                    <h3 className="font-bold text-gray-800">{facility.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{facility.type}</p>
                  </div>
                </div>
                <div className="mt-3 space-y-1 text-sm">
                  {facility.beds > 0 && (
                    <p className="text-gray-600">
                      <FaBed className="inline mr-2" />
                      {facility.available}/{facility.beds} {t('medical.availableBeds')}
                    </p>
                  )}
                  <p className="text-gray-600">
                    <FaUserMd className="inline mr-2" />
                    {facility.doctors} {t('medical.doctors')}
                  </p>
                  <p className="text-gray-600">
                    <FaPhone className="inline mr-2" />
                    <a href={`tel:${facility.contact}`} className="text-blue-600 hover:underline">
                      {facility.contact}
                    </a>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Active Emergencies */}
        {emergencies.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Active Emergencies ({emergencies.length})
            </h2>
            <div className="space-y-3">
              {emergencies.slice(0, 5).map((emergency) => (
                <div
                  key={emergency.id}
                  className={`border-l-4 p-4 rounded ${getSeverityColor(emergency.severity)}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{emergency.condition}</h3>
                      <p className="text-sm">{emergency.location}</p>
                      <p className="text-xs mt-1">
                        {new Date(emergency.requestTime).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      emergency.status === 'completed' ? 'bg-green-100 text-green-800' :
                      emergency.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {emergency.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalEmergency;
