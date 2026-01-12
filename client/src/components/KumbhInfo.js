import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaWater, FaOm, FaHistory } from 'react-icons/fa';

const KumbhInfo = () => {
  const locations = [
    {
      name: 'Prayagraj (Allahabad)',
      state: 'Uttar Pradesh',
      river: 'Ganges, Yamuna & Saraswati (Triveni Sangam)',
      icon: '🕉️',
      coords: [25.4358, 81.8463],
      description: 'The most sacred of all four locations, where three holy rivers converge. The Sangam (confluence) is believed to be the most auspicious bathing spot.',
      significance: 'Hosts the Maha Kumbh every 12 years',
      color: 'from-orange-500 to-orange-600',
      lightColor: 'from-orange-50 to-orange-100'
    },
    {
      name: 'Haridwar',
      state: 'Uttarakhand',
      river: 'Ganges',
      icon: '🏔️',
      coords: [29.9457, 78.1642],
      description: 'Gateway to the Himalayas where the Ganges leaves the mountains and enters the plains. Har Ki Pauri ghat is the main bathing area.',
      significance: 'One of the seven holiest places in Hinduism',
      color: 'from-blue-500 to-blue-600',
      lightColor: 'from-blue-50 to-blue-100'
    },
    {
      name: 'Nashik',
      state: 'Maharashtra',
      river: 'Godavari',
      icon: '⛰️',
      coords: [19.9975, 73.7898],
      description: 'Located on the banks of the sacred Godavari river. Ramkund is the primary bathing ghat associated with Lord Rama.',
      significance: 'Site of exile of Lord Rama in Ramayana',
      color: 'from-green-500 to-green-600',
      lightColor: 'from-green-50 to-green-100'
    },
    {
      name: 'Ujjain',
      state: 'Madhya Pradesh',
      river: 'Shipra',
      icon: '🛕',
      coords: [23.1765, 75.7885],
      description: 'Ancient city on the banks of river Shipra, home to the famous Mahakaleshwar Jyotirlinga temple. Ram Ghat is the main bathing location.',
      significance: 'One of the seven sacred cities (Sapta Puri)',
      color: 'from-purple-500 to-purple-600',
      lightColor: 'from-purple-50 to-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold mb-4">
            <span className="gradient-text">The Four Sacred Kumbh Mela Locations</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every 12 years, the Kumbh Mela rotates among these four sacred locations where drops of divine nectar (amrita) 
            from the Samudra Manthan fell, making a holy dip a powerful act of purification.
          </p>
        </motion.div>

        {/* Mythology Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-saffron-500 to-orange-600 rounded-2xl p-8 mb-12 text-white shadow-2xl"
        >
          <div className="flex items-center mb-4">
            <FaOm className="text-4xl mr-4" />
            <h2 className="text-3xl font-bold">The Legend of Samudra Manthan</h2>
          </div>
          <p className="text-lg leading-relaxed">
            According to Hindu mythology, during the churning of the cosmic ocean (Samudra Manthan), 
            a pot (kumbh) of divine nectar (amrita) emerged. As the gods and demons fought over it, 
            four drops fell to Earth at these four sacred locations. The Kumbh Mela commemorates this 
            celestial event, and bathing in these holy rivers during this time is believed to cleanse 
            all sins and grant moksha (liberation).
          </p>
        </motion.div>

        {/* Location Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {locations.map((location, index) => (
            <motion.div
              key={location.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-105"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${location.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-3xl font-bold">{location.name}</h3>
                  <span className="text-5xl">{location.icon}</span>
                </div>
                <p className="text-lg opacity-90">{location.state}</p>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="space-y-4">
                  {/* River Info */}
                  <div className="flex items-start">
                    <FaWater className={`text-2xl mr-3 mt-1 bg-gradient-to-r ${location.color} bg-clip-text text-transparent`} />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Sacred River(s)</h4>
                      <p className="text-gray-600">{location.river}</p>
                    </div>
                  </div>

                  {/* Location Info */}
                  <div className="flex items-start">
                    <FaMapMarkerAlt className={`text-2xl mr-3 mt-1 bg-gradient-to-r ${location.color} bg-clip-text text-transparent`} />
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Coordinates</h4>
                      <p className="text-gray-600 font-mono text-sm">
                        {location.coords[0].toFixed(4)}°N, {location.coords[1].toFixed(4)}°E
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed mb-3">{location.description}</p>
                  </div>

                  {/* Significance */}
                  <div className={`bg-gradient-to-r ${location.lightColor} p-4 rounded-lg`}>
                    <div className="flex items-start">
                      <FaHistory className={`text-xl mr-3 mt-1 bg-gradient-to-r ${location.color} bg-clip-text text-transparent`} />
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Special Significance</h4>
                        <p className="text-gray-700">{location.significance}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Rotation Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 gradient-text">12-Year Rotation Cycle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
              <div className="text-4xl mb-2">🕉️</div>
              <h3 className="font-bold text-lg mb-1">Prayagraj</h3>
              <p className="text-sm text-gray-600">Years: 2013, 2025, 2037</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="text-4xl mb-2">🏔️</div>
              <h3 className="font-bold text-lg mb-1">Haridwar</h3>
              <p className="text-sm text-gray-600">Years: 2010, 2022, 2034</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="text-4xl mb-2">⛰️</div>
              <h3 className="font-bold text-lg mb-1">Nashik</h3>
              <p className="text-sm text-gray-600">Years: 2015, 2027, 2039</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-4xl mb-2">🛕</div>
              <h3 className="font-bold text-lg mb-1">Ujjain</h3>
              <p className="text-sm text-gray-600">Years: 2016, 2028, 2040</p>
            </div>
          </div>
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-l-4 border-orange-500">
            <p className="text-gray-700">
              <strong>Note:</strong> The Maha Kumbh Mela, held at Prayagraj every 144 years (12 cycles), 
              is the largest and most significant. The next Maha Kumbh will be in 2025! 🎊
            </p>
          </div>
        </motion.div>

        {/* Fun Facts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6 gradient-text">Did You Know?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <span className="text-3xl mr-4">📊</span>
              <div>
                <h4 className="font-bold text-lg mb-2">World's Largest Gathering</h4>
                <p className="text-gray-700">
                  The 2019 Prayagraj Kumbh Mela attracted over 150 million visitors, 
                  making it the largest peaceful gathering in human history!
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">🌏</span>
              <div>
                <h4 className="font-bold text-lg mb-2">UNESCO Recognition</h4>
                <p className="text-gray-700">
                  In 2017, UNESCO inscribed Kumbh Mela on its Representative List of 
                  Intangible Cultural Heritage of Humanity.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">⏱️</span>
              <div>
                <h4 className="font-bold text-lg mb-2">Duration</h4>
                <p className="text-gray-700">
                  Each Kumbh Mela typically lasts for several weeks, with specific 
                  auspicious bathing dates (Shahi Snan) that attract the largest crowds.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <span className="text-3xl mr-4">🙏</span>
              <div>
                <h4 className="font-bold text-lg mb-2">Ancient Tradition</h4>
                <p className="text-gray-700">
                  References to Kumbh Mela can be found in ancient texts dating back 
                  over 2,000 years, making it one of the oldest surviving traditions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KumbhInfo;
