import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTemperatureHigh, FaWind, FaEye, FaSun, FaCloudRain, FaTint, FaExclamationTriangle } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';

const Weather = () => {
  const { t } = useTranslation();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('nashik');
  const [loading, setLoading] = useState(false);
  
  const kumbhLocations = {
    prayagraj: { name: 'Prayagraj (Allahabad)', state: 'Uttar Pradesh', lat: 25.4358, lon: 81.8463 },
    haridwar: { name: 'Haridwar', state: 'Uttarakhand', lat: 29.9457, lon: 78.1642 },
    nashik: { name: 'Nashik', state: 'Maharashtra', lat: 19.9975, lon: 73.7898 },
    ujjain: { name: 'Ujjain', state: 'Madhya Pradesh', lat: 23.1765, lon: 75.7885 }
  };

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [selectedLocation]);

  const fetchWeatherData = async () => {
    setLoading(true);
    try {
      const location = kumbhLocations[selectedLocation];
      const API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your API key
      
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!currentResponse.ok) {
        // Fallback to mock data if API fails
        generateMockWeatherData();
        return;
      }
      
      const currentData = await currentResponse.json();
      
      setCurrentWeather({
        temperature: Math.round(currentData.main.temp),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        pressure: currentData.main.pressure,
        visibility: Math.round(currentData.visibility / 1000),
        cloudiness: currentData.clouds.all
      });
      
      // Fetch 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lon}&units=metric&appid=${API_KEY}`
      );
      
      if (forecastResponse.ok) {
        const forecastData = await forecastResponse.json();
        const dailyForecasts = [];
        
        // Group by day and get one forecast per day
        const days = {};
        forecastData.list.forEach(item => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          if (!days[date]) {
            days[date] = {
              date: new Date(item.dt * 1000),
              temp: Math.round(item.main.temp),
              tempMin: Math.round(item.main.temp_min),
              tempMax: Math.round(item.main.temp_max),
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              humidity: item.main.humidity,
              windSpeed: Math.round(item.wind.speed * 3.6)
            };
          }
        });
        
        setForecast(Object.values(days).slice(0, 5));
      }
      
    } catch (error) {
      console.error('Error fetching weather data:', error);
      generateMockWeatherData();
    } finally {
      setLoading(false);
    }
  };
  
  const generateMockWeatherData = () => {
    // Mock data as fallback
    const mockTemps = {
      nashik: 28,
      prayagraj: 22,
      haridwar: 18,
      ujjain: 26
    };
    
    setCurrentWeather({
      temperature: mockTemps[selectedLocation],
      feelsLike: mockTemps[selectedLocation] + 2,
      humidity: 65,
      windSpeed: 12,
      description: 'Clear sky',
      icon: '01d',
      pressure: 1013,
      visibility: 10,
      cloudiness: 20
    });
    
    // Generate mock 5-day forecast
    const mockForecast = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      mockForecast.push({
        date: date,
        temp: mockTemps[selectedLocation] + Math.floor(Math.random() * 6 - 3),
        tempMin: mockTemps[selectedLocation] - 3,
        tempMax: mockTemps[selectedLocation] + 3,
        description: ['Clear sky', 'Partly cloudy', 'Sunny'][Math.floor(Math.random() * 3)],
        icon: '01d',
        humidity: 60 + Math.floor(Math.random() * 20),
        windSpeed: 10 + Math.floor(Math.random() * 10)
      });
    }
    setForecast(mockForecast);
  };

  const getWeatherIcon = (description, icon) => {
    if (icon) {
      return `https://openweathermap.org/img/wn/${icon}@2x.png`;
    }
    const desc = description?.toLowerCase() || '';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud')) return '☁️';
    if (desc.includes('sun') || desc.includes('clear')) return '☀️';
    if (desc.includes('fog')) return '🌫️';
    if (desc.includes('wind')) return '💨';
    return '🌤️';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'extreme': return 'bg-red-100 border-red-500 text-red-800';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-800';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-500 text-blue-800';
      default: return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  // Prepare chart data
  const getChartData = () => {
    if (!forecast.length) return null;

    const labels = forecast.map(f => getDayName(f.date));
    const temps = forecast.map(f => f.temp);

    return {
      labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temps,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  if (loading && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-xl text-gray-600">Loading weather data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">
            🌤️ Weather Information
          </h1>
          <p className="text-xl text-gray-600">Real-time weather updates for all Kumbh Mela locations</p>
        </motion.div>

        {/* Location Selector */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(kumbhLocations).map(([key, location]) => (
            <button
              key={key}
              onClick={() => setSelectedLocation(key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 shadow-md ${
                selectedLocation === key
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-blue-50 border-2 border-blue-200'
              }`}
            >
              <div className="text-center">
                <div className="font-bold">{location.name}</div>
                <div className="text-xs opacity-80">{location.state}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Current Weather */}
        {currentWeather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">Current Weather</h2>
                <p className="text-xl opacity-90 mb-4">{kumbhLocations[selectedLocation].name}</p>
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">
                    {currentWeather.icon ? (
                      <img src={getWeatherIcon(null, currentWeather.icon)} alt="weather" className="w-20 h-20" />
                    ) : (
                      getWeatherIcon(currentWeather.description)
                    )}
                  </div>
                  <div>
                    <div className="text-6xl font-bold">{currentWeather.temperature}°C</div>
                    <p className="text-xl opacity-90 capitalize">{currentWeather.description}</p>
                    <p className="text-sm opacity-75">Feels like {currentWeather.feelsLike}°C</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <FaTint className="text-3xl mx-auto mb-2 opacity-90" />
                  <p className="text-sm opacity-75">Humidity</p>
                  <p className="text-lg font-bold">{currentWeather.humidity}%</p>
                </div>
                <div className="text-center">
                  <FaWind className="text-3xl mx-auto mb-2 opacity-90" />
                  <p className="text-sm opacity-75">Wind Speed</p>
                  <p className="text-lg font-bold">{currentWeather.windSpeed} km/h</p>
                </div>
                <div className="text-center">
                  <FaEye className="text-3xl mx-auto mb-2 opacity-90" />
                  <p className="text-sm opacity-75">Visibility</p>
                  <p className="text-lg font-bold">{currentWeather.visibility} km</p>
                </div>
                <div className="text-center">
                  <FaSun className="text-3xl mx-auto mb-2 opacity-90" />
                  <p className="text-sm opacity-75">Pressure</p>
                  <p className="text-lg font-bold">{currentWeather.pressure} hPa</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 5-Day Forecast */}
        {forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">5-Day Forecast</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {forecast.map((day, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 text-center hover:shadow-lg transition"
                >
                  <p className="font-bold text-gray-700 mb-2">{getDayName(day.date)}</p>
                  <p className="text-xs text-gray-500 mb-3">{day.date.toLocaleDateString()}</p>
                  <div className="flex justify-center mb-2">
                    {day.icon ? (
                      <img src={getWeatherIcon(null, day.icon)} alt="weather" className="w-12 h-12" />
                    ) : (
                      <div className="text-3xl">{getWeatherIcon(day.description)}</div>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-blue-600 mb-1">{day.temp}°C</p>
                  <p className="text-xs text-gray-600 capitalize mb-2">{day.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>↓ {day.tempMin}°</span>
                    <span>↑ {day.tempMax}°</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Weather Advisory */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-2xl shadow-lg p-6"
        >
          <h3 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
            <FaExclamationTriangle className="mr-2" />
            Weather Advisory for Pilgrims
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-2">🌡️ Temperature Tips</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Carry water bottles (1-2 liters recommended)</li>
                <li>• Wear light, breathable clothing</li>
                <li>• Use umbrellas for sun protection</li>
                <li>• Avoid peak heat hours (12 PM - 3 PM)</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4">
              <h4 className="font-bold text-gray-800 mb-2">☔ Weather Precautions</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Check weather before bathing rituals</li>
                <li>• Keep raincoats/umbrellas handy</li>
                <li>• Follow crowd management advisories</li>
                <li>• Emergency helpline: 108</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Weather;
