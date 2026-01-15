import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  FaAmbulance, FaHospital, FaBed, FaPills, FaHeartbeat, 
  FaUserMd, FaPhone, FaMapMarkerAlt, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaInfoCircle, FaSearch,
  FaTruck, FaFirstAid, FaBookMedical, FaHospitalSymbol
} from 'react-icons/fa';

const MediTracker = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, beds, medicines, firstAid, ambulances
  const [bedAvailability, setBedAvailability] = useState(null);
  const [medicineInventory, setMedicineInventory] = useState([]);
  const [firstAidGuides, setFirstAidGuides] = useState([]);
  const [ambulances, setAmbulances] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAllData = async () => {
    try {
      const [bedsRes, medicinesRes, guidesRes, ambulancesRes, facilitiesRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/medical/bed-availability'),
        fetch('http://localhost:5000/api/medical/medicine-inventory'),
        fetch('http://localhost:5000/api/medical/first-aid-guides'),
        fetch('http://localhost:5000/api/medical/ambulances'),
        fetch('http://localhost:5000/api/medical/facilities'),
        fetch('http://localhost:5000/api/medical/stats')
      ]);

      const bedsData = await bedsRes.json();
      const medicinesData = await medicinesRes.json();
      const guidesData = await guidesRes.json();
      const ambulancesData = await ambulancesRes.json();
      const facilitiesData = await facilitiesRes.json();
      const statsData = await statsRes.json();

      if (bedsData.success) setBedAvailability(bedsData.data);
      if (medicinesData.success) setMedicineInventory(medicinesData.data);
      if (guidesData.success) setFirstAidGuides(guidesData.data);
      if (ambulancesData.success) setAmbulances(ambulancesData.data);
      if (facilitiesData.success) setFacilities(facilitiesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Error fetching medi-tracker data:', error);
    }
  };

  const getDensityColor = (percentage) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-orange-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStockStatus = (stock, threshold) => {
    const percentage = (stock / threshold) * 100;
    if (percentage <= 100) return { color: 'text-red-600', icon: <FaExclamationTriangle />, label: 'Critical' };
    if (percentage <= 200) return { color: 'text-yellow-600', icon: <FaInfoCircle />, label: 'Low' };
    return { color: 'text-green-600', icon: <FaCheckCircle />, label: 'Good' };
  };

  const filteredMedicines = medicineInventory.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || med.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(medicineInventory.map(m => m.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            🏥 Medi-Tracker
          </h1>
          <p className="text-xl text-gray-600">
            Real-time Medical Resource Tracking & Management
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              🏥 Hospital Beds
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              💊 Medicine Inventory
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
              🚑 Ambulance Tracking
            </span>
            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
              📖 First Aid Guides
            </span>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <FaHospitalSymbol /> },
            { id: 'beds', label: 'Bed Availability', icon: <FaBed /> },
            { id: 'medicines', label: 'Medicine Inventory', icon: <FaPills /> },
            { id: 'firstAid', label: 'First Aid Guides', icon: <FaFirstAid /> },
            { id: 'ambulances', label: 'Ambulances', icon: <FaAmbulance /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <FaBed className="text-4xl mb-3" />
                <div className="text-3xl font-bold">{bedAvailability?.available || 0}</div>
                <div className="text-blue-100">Available Beds</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <FaPills className="text-4xl mb-3" />
                <div className="text-3xl font-bold">{medicineInventory.length}</div>
                <div className="text-green-100">Medicine Types</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <FaAmbulance className="text-4xl mb-3" />
                <div className="text-3xl font-bold">
                  {ambulances.filter(a => a.status === 'available').length}
                </div>
                <div className="text-purple-100">Available Ambulances</div>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <FaHospital className="text-4xl mb-3" />
                <div className="text-3xl font-bold">{facilities.length}</div>
                <div className="text-orange-100">Medical Facilities</div>
              </div>
            </div>

            {/* Bed Capacity Overview */}
            {bedAvailability && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <FaBed className="text-blue-600" />
                  Bed Capacity Overview
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { type: 'ICU Beds', data: bedAvailability.icuBeds, color: 'red' },
                    { type: 'Emergency Beds', data: bedAvailability.emergencyBeds, color: 'orange' },
                    { type: 'General Beds', data: bedAvailability.generalBeds, color: 'green' }
                  ].map((bed, idx) => {
                    const percentage = Math.round(((bed.data.total - bed.data.available) / bed.data.total) * 100);
                    return (
                      <div key={idx} className="border rounded-xl p-4">
                        <div className="font-semibold mb-2">{bed.type}</div>
                        <div className="text-2xl font-bold mb-2">
                          {bed.data.available} / {bed.data.total}
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full ${getDensityColor(percentage)}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{percentage}% Occupied</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Critical Alerts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-600" />
                Critical Alerts
              </h3>
              <div className="space-y-3">
                {medicineInventory
                  .filter(m => m.stock <= m.threshold)
                  .slice(0, 5)
                  .map(med => (
                    <div key={med.id} className="flex items-center justify-between p-4 bg-red-50 border-l-4 border-red-500 rounded">
                      <div>
                        <div className="font-semibold text-red-900">{med.name}</div>
                        <div className="text-sm text-red-700">
                          Stock: {med.stock} {med.unit} (Threshold: {med.threshold})
                        </div>
                      </div>
                      <FaExclamationTriangle className="text-red-500 text-2xl" />
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bed Availability Tab */}
        {activeTab === 'beds' && bedAvailability && (
          <motion.div
            key="beds"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaBed className="text-blue-600" />
              Real-Time Bed Availability
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Overall Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Beds:</span>
                    <span className="font-bold">{bedAvailability.totalBeds}</span>
                  </div>
                  <div className="flex justify-between text-green-700">
                    <span>Available:</span>
                    <span className="font-bold">{bedAvailability.available}</span>
                  </div>
                  <div className="flex justify-between text-red-700">
                    <span>Occupied:</span>
                    <span className="font-bold">{bedAvailability.occupied}</span>
                  </div>
                  <div className="flex justify-between text-orange-700">
                    <span>Reserved:</span>
                    <span className="font-bold">{bedAvailability.reserved}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Bed Types</h3>
                <div className="space-y-4">
                  {[
                    { label: 'ICU Beds', ...bedAvailability.icuBeds },
                    { label: 'Emergency Beds', ...bedAvailability.emergencyBeds },
                    { label: 'General Beds', ...bedAvailability.generalBeds }
                  ].map((bed, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{bed.label}</span>
                        <span>{bed.available} / {bed.total}</span>
                      </div>
                      <div className="w-full bg-gray-300 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getDensityColor(((bed.total - bed.available) / bed.total) * 100)}`}
                          style={{ width: `${((bed.total - bed.available) / bed.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-500 text-center">
              Last updated: {new Date(bedAvailability.lastUpdated).toLocaleString()}
            </div>
          </motion.div>
        )}

        {/* Medicine Inventory Tab */}
        {activeTab === 'medicines' && (
          <motion.div
            key="medicines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaPills className="text-green-600" />
              Medicine Inventory
            </h2>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
                />
              </div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Medicine Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedicines.map(medicine => {
                const status = getStockStatus(medicine.stock, medicine.threshold);
                return (
                  <div key={medicine.id} className="border rounded-xl p-4 hover:shadow-lg transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{medicine.name}</h3>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {medicine.category}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 ${status.color}`}>
                        {status.icon}
                        <span className="text-sm font-semibold">{status.label}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Stock:</span>
                        <span className="font-semibold">{medicine.stock} {medicine.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Threshold:</span>
                        <span>{medicine.threshold} {medicine.unit}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Location:</span>
                        <span className="text-blue-600">{medicine.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Expiry:</span>
                        <span>{medicine.expiryDate}</span>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          medicine.stock <= medicine.threshold ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((medicine.stock / (medicine.threshold * 2)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* First Aid Guides Tab */}
        {activeTab === 'firstAid' && (
          <motion.div
            key="firstAid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <FaBookMedical className="text-red-600" />
                First Aid Guides for Pilgrims
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {firstAidGuides.map(guide => (
                  <div
                    key={guide.id}
                    onClick={() => setSelectedGuide(guide)}
                    className="border-2 rounded-xl p-5 cursor-pointer hover:shadow-lg transition hover:border-blue-500"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-xl">{guide.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        guide.severity === 'critical' ? 'bg-red-100 text-red-800' :
                        guide.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                        guide.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {guide.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Symptoms:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {guide.symptoms.slice(0, 3).map((symptom, idx) => (
                          <li key={idx}>{symptom}</li>
                        ))}
                      </ul>
                    </div>
                    <button className="text-blue-600 font-semibold text-sm hover:underline">
                      View Full Guide →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Guide Modal */}
            <AnimatePresence>
              {selectedGuide && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedGuide(null)}
                >
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-3xl font-bold">{selectedGuide.title}</h2>
                      <button
                        onClick={() => setSelectedGuide(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-bold text-lg mb-2 text-red-600">⚠️ Symptoms:</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedGuide.symptoms.map((symptom, idx) => (
                            <li key={idx}>{symptom}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-2 text-blue-600">📋 First Aid Steps:</h3>
                        <ol className="list-decimal list-inside space-y-2">
                          {selectedGuide.steps.map((step, idx) => (
                            <li key={idx} className="font-medium">{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div>
                        <h3 className="font-bold text-lg mb-2 text-green-600">🛡️ Prevention:</h3>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedGuide.prevention.map((prev, idx) => (
                            <li key={idx}>{prev}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                        <p className="font-semibold text-yellow-800">
                          ⚠️ If condition is severe or doesn't improve, seek immediate medical help!
                        </p>
                        <p className="text-sm text-yellow-700 mt-1">
                          Emergency Helpline: 108
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Ambulances Tab */}
        {activeTab === 'ambulances' && (
          <motion.div
            key="ambulances"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <FaAmbulance className="text-purple-600" />
              Ambulance Fleet Tracking
            </h2>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-green-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-green-600">
                  {ambulances.filter(a => a.status === 'available').length}
                </div>
                <div className="text-sm text-gray-600">Available</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {ambulances.filter(a => a.status === 'dispatched').length}
                </div>
                <div className="text-sm text-gray-600">Dispatched</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {ambulances.filter(a => !a.isPrivate).length}
                </div>
                <div className="text-sm text-gray-600">Government</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {ambulances.filter(a => a.isPrivate).length}
                </div>
                <div className="text-sm text-gray-600">Private</div>
              </div>
            </div>

            {/* Ambulance List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ambulances.map(ambulance => (
                <div
                  key={ambulance.id}
                  className={`border-2 rounded-xl p-5 ${
                    ambulance.status === 'available' 
                      ? 'border-green-300 bg-green-50' 
                      : 'border-orange-300 bg-orange-50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-xl">{ambulance.id}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        ambulance.isPrivate 
                          ? 'bg-purple-200 text-purple-800' 
                          : 'bg-blue-200 text-blue-800'
                      }`}>
                        {ambulance.isPrivate ? 'Private' : 'Government'}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      ambulance.status === 'available'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-orange-200 text-orange-800'
                    }`}>
                      {ambulance.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <FaHospital className="text-gray-600 mt-1" />
                      <span>{ambulance.facility}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaHeartbeat className="text-gray-600 mt-1" />
                      <span>{ambulance.type}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaTruck className="text-gray-600 mt-1" />
                      <span>{ambulance.equipment.join(', ')}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-gray-600 mt-1" />
                      <span>Lat: {ambulance.currentLat}, Lng: {ambulance.currentLng}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MediTracker;