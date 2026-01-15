import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { FaChartLine, FaClock, FaCalendarAlt, FaBrain } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const CrowdPrediction = () => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState('24h');
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    // Generate prediction data
    const generateData = () => {
      const hours = timeRange === '24h' ? 24 : timeRange === '48h' ? 48 : 168;
      const labels = [];
      const currentCrowd = [];
      const predictedCrowd = [];
      const confidence = [];

      for (let i = 0; i < hours; i++) {
        labels.push(timeRange === '7d' ? `Day ${Math.floor(i / 24) + 1}` : `${i}:00`);
        
        // Simulate crowd patterns (higher during day, lower at night)
        const hour = i % 24;
        const baseValue = hour >= 6 && hour <= 18 ? 
          Math.random() * 30000 + 70000 : 
          Math.random() * 20000 + 30000;
        
        currentCrowd.push(i < hours / 2 ? baseValue : null);
        predictedCrowd.push(i >= hours / 2 ? baseValue * (1 + (Math.random() - 0.5) * 0.3) : null);
        confidence.push(95 - Math.random() * 20);
      }

      setPredictionData({ labels, currentCrowd, predictedCrowd, confidence });
    };

    generateData();
    const interval = setInterval(generateData, 10000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const lineChartData = predictionData ? {
    labels: predictionData.labels,
    datasets: [
      {
        label: t('predictions.current'),
        data: predictionData.currentCrowd,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('predictions.predicted'),
        data: predictionData.predictedCrowd,
        borderColor: '#f97316',
        backgroundColor: 'rgba(249, 115, 22, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
      }
    ]
  } : null;

  const barChartData = {
    labels: ['Sangam Nose', 'Triveni Ghat', 'Parade Ground', 'Sector 1', 'Sector 2'],
    datasets: [
      {
        label: t('predictions.current'),
        data: [85000, 65000, 55000, 45000, 42000],
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
      },
      {
        label: t('predictions.predicted2h'),
        data: [95000, 72000, 48000, 52000, 38000],
        backgroundColor: 'rgba(249, 115, 22, 0.7)',
      }
    ]
  };

  const doughnutData = {
    labels: [t('crowd.low'), t('crowd.medium'), t('crowd.high'), t('crowd.critical')],
    datasets: [{
      data: [45, 30, 20, 5],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)',
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return (value / 1000).toFixed(0) + 'K';
          }
        }
      }
    }
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
              {t('predictions.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('predictions.subtitle')}
            </p>
          </div>

          {/* Time Range Selector */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <FaClock className="text-saffron-600 text-xl" />
                <span className="font-semibold text-gray-800">Prediction Range:</span>
              </div>
              <div className="flex space-x-2">
                {['24h', '48h', '7d'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                      timeRange === range
                        ? 'bg-gradient-to-r from-saffron-500 to-spiritual-green text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range === '24h' ? t('predictions.hours24') : range === '48h' ? t('predictions.hours48') : t('predictions.days7')}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Prediction Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaChartLine className="text-saffron-600 mr-3" />
                Crowd Density Forecast
              </h2>
              <div className="flex items-center space-x-2 text-sm">
                <FaBrain className="text-purple-600" />
                <span className="text-gray-600">AI Model Accuracy: <strong>94.2%</strong></span>
              </div>
            </div>
            <div className="h-96">
              {lineChartData && (
                <Line data={lineChartData} options={chartOptions} />
              )}
            </div>
          </div>

          {/* Zone-wise Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <FaCalendarAlt className="text-blue-600 mr-2" />
                Zone-wise Predictions
              </h3>
              <div className="h-80">
                <Bar data={barChartData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Risk Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <Doughnut 
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      }
                    }
                  }}
                />
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Next Critical Period:</span>
                  <span className="font-bold text-red-600">2-4 PM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best Visit Time:</span>
                  <span className="font-bold text-green-600">6-8 AM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Peak Hours',
                value: '12 PM - 4 PM',
                description: 'Expected maximum crowd',
                color: 'from-red-500 to-red-600',
                icon: '⏰'
              },
              {
                title: 'Best Time to Visit',
                value: '6 AM - 9 AM',
                description: 'Lowest crowd density',
                color: 'from-green-500 to-green-600',
                icon: '✅'
              },
              {
                title: 'Crowd Growth',
                value: '+15%',
                description: 'Expected in next 6 hours',
                color: 'from-orange-500 to-orange-600',
                icon: '📈'
              }
            ].map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-3">{insight.icon}</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">{insight.title}</h3>
                <p className={`text-3xl font-bold bg-gradient-to-r ${insight.color} bg-clip-text text-transparent mb-2`}>
                  {insight.value}
                </p>
                <p className="text-gray-600 text-sm">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CrowdPrediction;
