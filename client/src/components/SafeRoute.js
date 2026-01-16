import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { motion } from 'framer-motion';
import { FaRoute, FaMapMarkerAlt, FaClock, FaWalking } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const SafeRoute = () => {
  const { t } = useTranslation();
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState('');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState('prayagraj');

  // Four sacred Kumbh Mela locations with their key landmarks
  const kumbhLocations = {
    prayagraj: {
      name: 'Prayagraj',
      center: [25.4358, 81.8463],
      locations: [
        { name: 'Sangam Nose (Triveni Sangam)', coords: [25.4358, 81.8463] },
        { name: 'Triveni Ghat', coords: [25.4288, 81.8403] },
        { name: 'Saraswati Ghat', coords: [25.4338, 81.8403] },
        { name: 'Akshayavat (Immortal Banyan Tree)', coords: [25.4398, 81.8343] },
        { name: 'Parade Ground', coords: [25.4428, 81.8523] },
        { name: 'Sector 1', coords: [25.4198, 81.8343] },
        { name: 'Sector 2', coords: [25.4518, 81.8583] },
      ]
    },
    haridwar: {
      name: 'Haridwar',
      center: [29.9457, 78.1642],
      locations: [
        { name: 'Har Ki Pauri', coords: [29.9457, 78.1642] },
        { name: 'Brahma Kund', coords: [29.9467, 78.1652] },
        { name: 'Gau Ghat', coords: [29.9437, 78.1632] },
        { name: 'Vishnu Ghat', coords: [29.9477, 78.1662] },
        { name: 'Mansa Devi Temple', coords: [29.9827, 78.1712] },
        { name: 'Chandi Devi Temple', coords: [30.0047, 78.1882] },
      ]
    },
    nashik: {
      name: 'Nashik',
      center: [19.9975, 73.7898],
      locations: [
        { name: 'Ramkund (Holy Tank)', coords: [19.9975, 73.7898] },
        { name: 'Kushavarta Kund', coords: [19.9985, 73.7908] },
        { name: 'Naroshankar Temple', coords: [19.9965, 73.7888] },
        { name: 'Sita Gufa (Cave)', coords: [19.9955, 73.7878] },
        { name: 'Kalaram Temple', coords: [19.9995, 73.7918] },
        { name: 'Panchavati (Five Banyan Trees)', coords: [20.0005, 73.7928] },
        { name: 'Sundar Narayan Temple', coords: [19.9945, 73.7918] },
        { name: 'Kapaleshwar Temple', coords: [20.0015, 73.7938] },
        { name: 'Tapovan', coords: [20.0025, 73.7948] },
        { name: 'Trimbakeshwar (Jyotirlinga)', coords: [19.9340, 73.5290] },
        { name: 'Gangapur Dam', coords: [19.7005, 75.0128] },
        { name: 'Someshwar Temple', coords: [19.9925, 73.7858] },
        { name: 'Muktidham Temple', coords: [19.9735, 73.7658] },
        { name: 'Saptashrungi Devi Temple', coords: [20.4167, 74.0833] },
        { name: 'Coin Museum', coords: [19.9935, 73.7868] },
        { name: 'Godavari River Ghat', coords: [19.9965, 73.7908] },
        { name: 'Dudhsagar Waterfall', coords: [19.9415, 73.7255] },
        { name: 'Anjaneri Hills (Hanuman Birthplace)', coords: [20.0500, 73.7500] },
        { name: 'Ganga Ghat', coords: [19.9970, 73.7905] },
        { name: 'Ahilya Ghat', coords: [19.9980, 73.7895] },
        { name: 'Ram Ghat', coords: [19.9960, 73.7900] },
        { name: 'Lakshman Ghat', coords: [19.9950, 73.7890] },
        { name: 'Sita Ghat', coords: [19.9990, 73.7910] },
        { name: 'Hanuman Ghat', coords: [19.9985, 73.7885] },
        { name: 'Triveni Sangam Ghat', coords: [20.0000, 73.7920] },
        { name: 'Naro Shankar Ghat', coords: [19.9945, 73.7895] },
        { name: 'Kala Aram Mandir', coords: [19.9992, 73.7915] },
        { name: 'Goraram Temple', coords: [19.9940, 73.7870] },
        { name: 'Sunder Narayan Mandir', coords: [19.9948, 73.7922] },
        { name: 'Kashi Vishweshwar Temple', coords: [19.9958, 73.7912] },
        { name: 'Balaji Temple', coords: [19.9968, 73.7902] },
        { name: 'Datta Mandir', coords: [19.9978, 73.7892] },
        { name: 'Bhaktidham Temple', coords: [19.9988, 73.7882] },
        { name: 'Pandavleni Caves', coords: [20.0043, 73.7593] },
        { name: 'Shree Vihigaon Ganpati Temple', coords: [19.9720, 73.7780] },
        { name: 'Naroshankar Temple Complex', coords: [19.9962, 73.7886] },
        { name: 'Dattatreya Temple', coords: [19.9952, 73.7896] },
        { name: 'Gajanan Maharaj Temple', coords: [19.9942, 73.7906] },
        { name: 'Vitthal Rukmini Temple', coords: [19.9932, 73.7916] },
        { name: 'Shani Shingnapur', coords: [19.6667, 74.7333] },
        { name: 'Shirdi Sai Baba Temple', coords: [19.7645, 74.4770] },
        { name: 'Kedarnath Temple Nashik', coords: [19.9922, 73.7926] },
        { name: 'Mahalaxmi Temple', coords: [19.9912, 73.7936] },
        { name: 'Navgraha Shani Temple', coords: [19.9902, 73.7946] },
        { name: 'Gadge Maharaj Temple', coords: [19.9892, 73.7956] },
        { name: 'Swami Samarth Math', coords: [19.9882, 73.7866] },
        { name: 'Bhadrakali Temple', coords: [19.9872, 73.7876] },
        { name: 'Shree Ram Mandir', coords: [19.9862, 73.7886] },
        { name: 'Sai Baba Temple Nashik', coords: [19.9852, 73.7896] },
        { name: 'Ganesh Temple Panchavati', coords: [20.0012, 73.7925] },
        { name: 'Durga Temple', coords: [20.0022, 73.7935] },
        { name: 'Mahadev Temple', coords: [20.0032, 73.7945] },
        { name: 'Nandur Madhmeshwar Bird Sanctuary', coords: [19.9850, 74.6500] },
        { name: 'Vihigaon Waterfall', coords: [19.9800, 73.7700] },
        { name: 'Amruteshwar Temple', coords: [19.5667, 73.9167] },
        { name: 'Ghrishneshwar Temple', coords: [20.0244, 75.1764] },
        { name: 'Shree Somjai Temple', coords: [19.9820, 73.7820] },
        { name: 'Prati Balaji Temple', coords: [19.9810, 73.7810] },
        { name: 'Durgadevi Temple', coords: [19.9790, 73.7790] },
        { name: 'Mahakali Temple', coords: [19.9780, 73.7780] },
        { name: 'Rameshwar Temple', coords: [19.9770, 73.7770] }
      ]
    },
    ujjain: {
      name: 'Ujjain',
      center: [23.1765, 75.7885],
      locations: [
        { name: 'Ram Ghat', coords: [23.1765, 75.7885] },
        { name: 'Mahakaleshwar Temple', coords: [23.1825, 75.7685] },
        { name: 'Kshipra River Bank', coords: [23.1745, 75.7865] },
        { name: 'Harsiddhi Temple', coords: [23.1785, 75.7905] },
        { name: 'Kal Bhairav Temple', coords: [23.1805, 75.7925] },
        { name: 'Mangalnath Temple', coords: [23.1995, 75.7665] },
      ]
    }
  };

  const center = kumbhLocations[selectedCity].center;
  const locations = kumbhLocations[selectedCity].locations;

  const findRoute = () => {
    setLoading(true);
    
    // Simulate route calculation
    setTimeout(() => {
      const start = locations.find(loc => loc.name === startPoint);
      const end = locations.find(loc => loc.name === endPoint);

      if (start && end) {
        // Generate a simple route with waypoints
        const waypoints = [
          start.coords,
          [(start.coords[0] + end.coords[0]) / 2, (start.coords[1] + end.coords[1]) / 2],
          end.coords
        ];

        setRoute({
          path: waypoints,
          distance: (Math.random() * 3 + 1).toFixed(1),
          time: Math.floor(Math.random() * 20 + 10),
          crowdLevel: Math.random() < 0.5 ? 'Low' : 'Medium',
          start: start,
          end: end
        });
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              {t('routes.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('routes.avoidCrowds')}
            </p>
            
            {/* City Selector */}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {Object.entries(kumbhLocations).map(([key, city]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedCity(key);
                    setStartPoint('');
                    setEndPoint('');
                    setRoute(null);
                  }}
                  className={`px-5 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${
                    selectedCity === key
                      ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-green-50 border-2 border-green-200'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          {/* Route Selection */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                  {t('routes.from')}
                </label>
                <select
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('routes.selectStart')}</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                  {t('routes.to')}
                </label>
                <select
                  value={endPoint}
                  onChange={(e) => setEndPoint(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-saffron-500 focus:border-transparent outline-none"
                >
                  <option value="">{t('routes.selectEnd')}</option>
                  {locations.map((loc, index) => (
                    <option key={index} value={loc.name}>
                      {loc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={findRoute}
                  disabled={!startPoint || !endPoint || loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-saffron-500 to-spiritual-green text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-300"
                >
                  {loading ? t('routes.calculating') : t('routes.findRoute')}
                </motion.button>
              </div>
            </div>

            {/* Route Info */}
            {route && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <FaRoute className="text-2xl text-blue-600 mb-2" />
                  <p className="text-sm text-gray-600">{t('routes.distance')}</p>
                  <p className="text-2xl font-bold text-gray-800">{route.distance} km</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <FaClock className="text-2xl text-green-600 mb-2" />
                  <p className="text-sm text-gray-600">{t('routes.estTime')}</p>
                  <p className="text-2xl font-bold text-gray-800">{route.time} min</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <FaWalking className="text-2xl text-purple-600 mb-2" />
                  <p className="text-sm text-gray-600">{t('routes.crowdLevel')}</p>
                  <p className="text-2xl font-bold text-gray-800">{route.crowdLevel}</p>
                </div>
                <div className="bg-gradient-to-br from-saffron-50 to-saffron-100 rounded-lg p-4">
                  <div className="text-2xl mb-2">✓</div>
                  <p className="text-sm text-gray-600">{t('routes.safety')}</p>
                  <p className="text-2xl font-bold text-gray-800">{t('routes.safetyHigh')}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Map */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <MapContainer              key={selectedCity}              center={center}
              zoom={13}
              style={{ height: '600px', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Location markers */}
              {locations.map((loc, index) => (
                <Marker key={index} position={loc.coords}>
                  <Popup>
                    <strong>{loc.name}</strong>
                  </Popup>
                </Marker>
              ))}

              {/* Route path */}
              {route && (
                <>
                  <Polyline
                    positions={route.path}
                    color="#10b981"
                    weight={5}
                    opacity={0.7}
                  />
                  <Marker position={route.start.coords}>
                    <Popup>
                      <strong>{t('routes.startLabel')}: {route.start.name}</strong>
                    </Popup>
                  </Marker>
                  <Marker position={route.end.coords}>
                    <Popup>
                      <strong>{t('routes.endLabel')}: {route.end.name}</strong>
                      <strong>Destination: {route.end.name}</strong>
                    </Popup>
                  </Marker>
                </>
              )}
            </MapContainer>
          </div>

          {/* Safety Tips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 bg-gradient-to-r from-saffron-50 to-green-50 rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Safety Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                'Stay on designated paths',
                'Keep emergency contacts handy',
                'Follow crowd control instructions',
                'Avoid peak hours if possible',
                'Stay hydrated and take breaks',
                'Use buddy system for groups'
              ].map((tip, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-saffron-600 rounded-full mt-2"></div>
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SafeRoute;
