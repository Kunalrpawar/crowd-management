import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaUser, FaMapMarkerAlt, FaPhone, FaImage, FaTshirt, FaIdCard } from 'react-icons/fa';

const LostFound = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('search');
  const [missingPersons, setMissingPersons] = useState([]);
  const [foundPersons, setFoundPersons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    description: '',
    lastSeenLocation: '',
    contactNumber: '',
    clothingDescription: '',
    identificationMarks: ''
  });

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const [missingRes, foundRes] = await Promise.all([
        fetch('http://localhost:5000/api/lostfound/missing'),
        fetch('http://localhost:5000/api/lostfound/found')
      ]);
      const missingData = await missingRes.json();
      const foundData = await foundRes.json();
      
      if (missingData.success) setMissingPersons(missingData.data);
      if (foundData.success) setFoundPersons(foundData.data);
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    try {
      const endpoint = type === 'missing' ? '/missing' : '/found';
      const response = await fetch(`http://localhost:5000/api/lostfound/report${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      if (data.success) {
        alert(t('lostFound.success'));
        setFormData({
          name: '',
          age: '',
          gender: '',
          description: '',
          lastSeenLocation: '',
          contactNumber: '',
          clothingDescription: '',
          identificationMarks: ''
        });
        fetchCases();
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert(t('lostFound.error'));
    }
  };

  const CaseCard = ({ person, type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md p-4 mb-4 border-l-4 border-orange-500"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800">
            {person.name || t('lostFound.found')}
          </h3>
          <div className="mt-2 space-y-1 text-sm text-gray-600">
            <p><strong>{t('lostFound.age')}:</strong> {person.age || person.approximateAge}</p>
            <p><strong>{t('lostFound.gender')}:</strong> {person.gender}</p>
            <p><strong>{t('lostFound.location')}:</strong> {person.lastSeenLocation || person.currentLocation}</p>
            {person.clothingDescription && (
              <p><strong>{t('lostFound.clothing')}:</strong> {person.clothingDescription}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              {new Date(person.reportedAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="ml-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            person.status === 'missing' ? 'bg-red-100 text-red-800' :
            person.status === 'found' ? 'bg-green-100 text-green-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {t(`lostFound.${person.status}`)}
          </span>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">
          {t('lostFound.viewDetails')}
        </button>
        {person.contactNumber && (
          <a href={`tel:${person.contactNumber}`} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            {t('lostFound.contact')}
          </a>
        )}
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-orange-600 mb-2">
            {t('lostFound.title')}
          </h1>
          <p className="text-gray-600">{t('lostFound.search')}</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6 space-x-4">
          {['search', 'reportMissing', 'reportFound'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-orange-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-orange-100'
              }`}
            >
              {t(`lostFound.${tab}`)}
            </button>
          ))}
        </div>

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                {t('lostFound.missing')} ({missingPersons.length})
              </h2>
              {loading ? (
                <p>{t('common.loading')}</p>
              ) : missingPersons.length === 0 ? (
                <p className="text-gray-500">{t('lostFound.noMatches')}</p>
              ) : (
                missingPersons.map(person => (
                  <CaseCard key={person.id} person={person} type="missing" />
                ))
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-600 mb-4">
                {t('lostFound.found')} ({foundPersons.length})
              </h2>
              {loading ? (
                <p>{t('common.loading')}</p>
              ) : foundPersons.length === 0 ? (
                <p className="text-gray-500">{t('lostFound.noMatches')}</p>
              ) : (
                foundPersons.map(person => (
                  <CaseCard key={person.id} person={person} type="found" />
                ))
              )}
            </div>
          </div>
        )}

        {/* Report Missing Tab */}
        {activeTab === 'reportMissing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-red-600 mb-6">
              {t('lostFound.reportMissing')}
            </h2>
            <form onSubmit={(e) => handleSubmit(e, 'missing')} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FaUser className="inline mr-2" />
                    {t('lostFound.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('lostFound.gender')}
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">{t('common.select')}</option>
                  <option value="Male">{t('lostFound.male')}</option>
                  <option value="Female">{t('lostFound.female')}</option>
                  <option value="Other">{t('lostFound.other')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="inline mr-2" />
                  {t('lostFound.lastSeen')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastSeenLocation}
                  onChange={(e) => setFormData({...formData, lastSeenLocation: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="inline mr-2" />
                  {t('lostFound.contact')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaTshirt className="inline mr-2" />
                  {t('lostFound.clothing')}
                </label>
                <textarea
                  value={formData.clothingDescription}
                  onChange={(e) => setFormData({...formData, clothingDescription: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaIdCard className="inline mr-2" />
                  {t('lostFound.identificationMarks')}
                </label>
                <textarea
                  value={formData.identificationMarks}
                  onChange={(e) => setFormData({...formData, identificationMarks: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                {t('common.submit')}
              </button>
            </form>
          </motion.div>
        )}

        {/* Report Found Tab */}
        {activeTab === 'reportFound' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-green-600 mb-6">
              {t('lostFound.reportFound')}
            </h2>
            <form onSubmit={(e) => handleSubmit(e, 'found')} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('lostFound.age')}
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('lostFound.gender')}
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">{t('common.select')}</option>
                    <option value="Male">{t('lostFound.male')}</option>
                    <option value="Female">{t('lostFound.female')}</option>
                    <option value="Other">{t('lostFound.other')}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="inline mr-2" />
                  {t('medical.location')} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastSeenLocation}
                  onChange={(e) => setFormData({...formData, lastSeenLocation: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaPhone className="inline mr-2" />
                  {t('lostFound.contact')} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contactNumber}
                  onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('lostFound.description')}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaTshirt className="inline mr-2" />
                  {t('lostFound.clothing')}
                </label>
                <textarea
                  value={formData.clothingDescription}
                  onChange={(e) => setFormData({...formData, clothingDescription: e.target.value})}
                  rows="2"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                {t('common.submit')}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LostFound;
