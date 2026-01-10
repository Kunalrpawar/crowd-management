import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaPlay, FaPause, FaUsers, FaExclamationTriangle } from 'react-icons/fa';

const LiveVideoFeed = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState({
    totalPeople: 0,
    density: 0,
    alerts: 0
  });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    // Simulate real-time detections
    if (isPlaying) {
      const interval = setInterval(() => {
        const newDetections = Array.from({ length: Math.floor(Math.random() * 20) + 10 }, (_, i) => ({
          id: i,
          x: Math.random() * 80 + 10,
          y: Math.random() * 80 + 10,
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2)
        }));
        
        setDetections(newDetections);
        setStats({
          totalPeople: newDetections.length,
          density: ((newDetections.length / 100) * 100).toFixed(1),
          alerts: newDetections.length > 15 ? 1 : 0
        });

        // Draw bounding boxes on canvas
        drawBoundingBoxes(newDetections);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  const drawBoundingBoxes = (detections) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach((detection) => {
      const x = (detection.x / 100) * canvas.width;
      const y = (detection.y / 100) * canvas.height;
      const width = 40;
      const height = 60;

      // Draw bounding box
      ctx.strokeStyle = detection.confidence > 0.85 ? '#10b981' : '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(x - width / 2, y - height / 2, width, height);

      // Draw confidence label
      ctx.fillStyle = detection.confidence > 0.85 ? '#10b981' : '#f59e0b';
      ctx.font = '12px Arial';
      ctx.fillText(`${(detection.confidence * 100).toFixed(0)}%`, x - width / 2, y - height / 2 - 5);
    });
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
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
              Live Video Feed - AI Detection
            </h1>
            <p className="text-gray-600 text-lg">
              YOLO-powered real-time crowd detection and counting
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">People Detected</p>
                  <p className="text-4xl font-bold text-blue-600">{stats.totalPeople}</p>
                </div>
                <FaUsers className="text-5xl text-blue-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Crowd Density</p>
                  <p className="text-4xl font-bold text-saffron-600">{stats.density}%</p>
                </div>
                <FaVideo className="text-5xl text-saffron-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Active Alerts</p>
                  <p className="text-4xl font-bold text-red-600">{stats.alerts}</p>
                </div>
                <FaExclamationTriangle className="text-5xl text-red-600 opacity-20" />
              </div>
            </motion.div>
          </div>

          {/* Video Feed */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-saffron-500 to-spiritual-green p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <FaVideo className="mr-2" />
                  Camera Feed - Zone A (Sangam Nose)
                </h2>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  isPlaying ? 'bg-green-500 text-white animate-pulse' : 'bg-gray-300 text-gray-700'
                }`}>
                  {isPlaying ? '● LIVE' : '○ PAUSED'}
                </span>
              </div>
            </div>

            <div className="relative bg-gray-900 aspect-video">
              {/* Simulated video background */}
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FaVideo className="text-6xl mb-4 mx-auto" />
                  <p className="text-lg">Live Camera Feed</p>
                  <p className="text-sm mt-2">Click Play to start detection</p>
                </div>
              </div>

              {/* Canvas for bounding boxes */}
              <canvas
                ref={canvasRef}
                width={1280}
                height={720}
                className="absolute inset-0 w-full h-full"
              />

              {/* Play/Pause Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  onClick={togglePlay}
                  className="pointer-events-auto w-20 h-20 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  {isPlaying ? (
                    <FaPause className="text-white text-3xl" />
                  ) : (
                    <FaPlay className="text-white text-3xl ml-1" />
                  )}
                </button>
              </div>

              {/* Detection Info Overlay */}
              {isPlaying && (
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white text-sm">
                  <p className="mb-1"><strong>Model:</strong> YOLOv8</p>
                  <p className="mb-1"><strong>FPS:</strong> 30</p>
                  <p><strong>Confidence:</strong> &gt; 70%</p>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-between">
                <div className="flex space-x-4">
                  <button
                    onClick={togglePlay}
                    className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                      isPlaying
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isPlaying ? 'Stop Detection' : 'Start Detection'}
                  </button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>High Confidence</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Medium Confidence</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-time Detection',
                description: 'YOLO v8 model processes video at 30 FPS',
                icon: '⚡'
              },
              {
                title: 'Accurate Counting',
                description: 'Count people with 95%+ accuracy',
                icon: '🎯'
              },
              {
                title: 'Instant Alerts',
                description: 'Get notified when crowd exceeds threshold',
                icon: '🔔'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md p-6 border border-gray-100"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveVideoFeed;
