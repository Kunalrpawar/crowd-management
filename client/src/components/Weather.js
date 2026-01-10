import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FaTemperatureHigh, FaWind, FaEye, FaSun, FaCloudRain, FaTint, FaExclamationTriangle } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';

const Weather = () => {
  const { t } = useTranslation();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [advisories, setAdvisories] = useState([]);
  const [bathingTimes, setBathingTimes] = useState(null);
  const [forecastType, setForecastType] = useState('hourly');

  useEffect(() => {
    fetchWeatherData();
    const interval = setInterval(fetchWeatherData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [forecastType]);

  const fetchWeatherData = async () => {
    try {
      const [currentRes, forecastRes, alertsRes, advisoriesRes, bathingRes] = await Promise.all([
        fetch('http://localhost:5000/api/weather/current'),
        fetch(`http://localhost:5000/api/weather/forecast?type=${forecastType}`),
        fetch('http://localhost:5000/api/weather/alerts?active=true'),
        fetch('http://localhost:5000/api/weather/advisories'),
        fetch('http://localhost:5000/api/weather/bathing-times')
      ]);

      const currentData = await currentRes.json();
      const forecastData = await forecastRes.json();
      const alertsData = await alertsRes.json();
      const advisoriesData = await advisoriesRes.json();
      const bathingData = await bathingRes.json();

      if (currentData.success) setCurrentWeather(currentData.data);
      if (forecastData.success) setForecast(forecastData.data);
      if (alertsData.success) setAlerts(alertsData.data);
      if (advisoriesData.success) setAdvisories(advisoriesData.data);
      if (bathingData.success) setBathingTimes(bathingData.data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const getWeatherIcon = (description) => {
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

  // Prepare chart data
  const getChartData = () => {
    if (!forecast.length) return null;

    const labels = forecastType === 'hourly' 
      ? forecast.map(f => `${f.hour}:00`)
      : forecast.map(f => f.day);

    const temps = forecastType === 'hourly'
      ? forecast.map(f => f.temperature)
      : forecast.map(f => (f.tempMin + f.tempMax) / 2);

    return {
      labels,
      datasets: [
        {
          label: t('weather.temperature'),
          data: temps,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4
        }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-blue-600 mb-2">
            {t('weather.title')}
          </h1>
          <p className="text-gray-600">Prayagraj, Uttar Pradesh</p>
        </motion.div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <div className="mb-6">
            {alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`border-l-4 p-4 rounded-lg mb-3 ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-2xl mr-3 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{alert.title}</h3>
                    <p className="text-sm mt-1">{alert.message}</p>
                    <p className="text-xs mt-2">
                      Valid until: {new Date(alert.validUntil).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Current Weather */}
        {currentWeather && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl shadow-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">{t('weather.current')}</h2>
                <div className="flex items-center space-x-4">
                  <div className="text-6xl">{getWeatherIcon(currentWeather.description)}</div>
                  <div>
                    <div className="text-5xl font-bold">{currentWeather.temperature}°C</div>
                    <p className="text-xl opacity-90">{currentWeather.description}</p>
                  </div>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-sm opacity-90">
                  {t('weather.feelsLike')}: {currentWeather.feelsLike}°C
                </p>
                <p className="text-sm opacity-90">
                  {t('weather.humidity')}: {currentWeather.humidity}%
                </p>
                <p className="text-sm opacity-90">
                  {t('weather.windSpeed')}: {currentWeather.windSpeed} km/h
                </p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/30">
              <div className="text-center">
                <FaEye className="text-2xl mx-auto mb-1 opacity-75" />
                <p className="text-sm opacity-90">{t('weather.visibility')}</p>
                <p className="font-bold">{currentWeather.visibility} km</p>
              </div>
              <div className="text-center">
                <FaSun className="text-2xl mx-auto mb-1 opacity-75" />
                <p className="text-sm opacity-90">{t('weather.uvIndex')}</p>
                <p className="font-bold">{currentWeather.uvIndex}</p>
              </div>
              <div className="text-center">
                <FaTint className="text-2xl mx-auto mb-1 opacity-75" />
                <p className="text-sm opacity-90">{t('weather.airQuality')}</p>
                <p className="font-bold">{currentWeather.airQuality}</p>
              </div>
              <div className="text-center">
                <FaWind className="text-2xl mx-auto mb-1 opacity-75" />
                <p className="text-sm opacity-90">Direction</p>
                <p className="font-bold">{currentWeather.windDirection}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Forecast Toggle */}
        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={() => setForecastType('hourly')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              forecastType === 'hourly'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-100'
            }`}
          >
            {t('weather.hourly')} (24h)
          </button>
          <button
            onClick={() => setForecastType('daily')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              forecastType === 'daily'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-blue-100'
            }`}
          >
            {t('weather.daily')} (7 days)
          </button>
        </div>

        {/* Forecast Chart */}
        {forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-lg p-6 mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('weather.forecast')}
            </h2>
            <Line
              data={getChartData()}
              options={{
                responsive: true,
                plugins: {
                  legend: { display: false }
                },
                scales: {
                  y: {
                    ticks: {
                      callback: (value) => `${value}°C`
                    }
                  }
                }
              }}
            />
          </motion.div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Bathing Times */}
          {bathingTimes && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {t('weather.bathingTimes')}
              </h2>
              <div className="mb-4">
                <span className={`inline-block px-4 py-2 rounded-full font-semibold ${
                  bathingTimes.currentStatus === 'Favorable' ? 'bg-green-100 text-green-800' :
                  bathingTimes.currentStatus === 'Caution Advised' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  Current: {bathingTimes.currentStatus}
                </span>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-green-600">Best Times:</h3>
                {bathingTimes.bestTimes?.map((time, idx) => (
                  <div key={idx} className="bg-green-50 p-3 rounded-lg">
                    <p className="font-bold">{time.slot}</p>
                    <p className="text-sm text-gray-600">{time.reason}</p>
                    <p className="text-xs text-gray-500">Crowd: {time.crowdLevel}</p>
                  </div>
                ))}

                {bathingTimes.avoidTimes?.length > 0 && (
                  <>
                    <h3 className="font-semibold text-red-600 mt-4">Avoid:</h3>
                    {bathingTimes.avoidTimes.map((time, idx) => (
                      <div key={idx} className="bg-red-50 p-3 rounded-lg">
                        <p className="font-bold">{time.slot}</p>
                        <p className="text-sm text-gray-600">{time.reason}</p>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* Weather Advisories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {t('weather.advisories')}
            </h2>
            <div className="space-y-4">
              {advisories.map((advisory, idx) => (
                <div key={idx} className={`border-l-4 p-4 rounded ${getSeverityColor(advisory.severity)}`}>
                  <div className="flex items-start">
                    <span className="text-2xl mr-3">{advisory.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-bold">{advisory.type.toUpperCase()}</h3>
                      <p className="text-sm mt-1">{advisory.message}</p>
                      {advisory.recommendations && (
                        <ul className="mt-2 text-xs space-y-1">
                          {advisory.recommendations.map((rec, i) => (
                            <li key={i}>• {rec}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Forecast Grid */}
        {forecast.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {forecastType === 'hourly' ? 'Hourly Details' : 'Daily Forecast'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {forecast.slice(0, 12).map((item, idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-lg text-center">
                  <p className="font-bold text-gray-800">
                    {forecastType === 'hourly' ? `${item.hour}:00` : item.day}
                  </p>
                  <div className="text-3xl my-2">{getWeatherIcon(item.description)}</div>
                  <p className="text-2xl font-bold text-blue-600">
                    {forecastType === 'hourly' ? `${item.temperature}°` : `${item.tempMin}-${item.tempMax}°`}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    <FaCloudRain className="inline mr-1" />
                    {item.chanceOfRain}%
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Weather;
