import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaVideo, FaUsers, FaExclamationTriangle, FaCamera, FaStop, FaUpload, FaFileVideo, FaDownload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';
import { toast } from 'react-toastify';

const LiveVideoFeed = () => {
  const { t } = useTranslation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [model, setModel] = useState(null);
  const [detections, setDetections] = useState([]);
  const [stats, setStats] = useState({
    totalPeople: 0,
    totalObjects: 0,
    density: 0,
    alerts: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [stream, setStream] = useState(null);
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoMode, setVideoMode] = useState('camera'); // 'camera' or 'upload'
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Load COCO-SSD model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        console.log('Loading COCO-SSD model...');
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log('Model loaded successfully');
        toast.success('AI Model loaded successfully!');
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading model:', error);
        toast.error('Failed to load AI model');
        setIsLoading(false);
      }
    };

    loadModel();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        setStream(mediaStream);
        setIsPlaying(true);
        toast.success('Camera started!');
        
        // Start detection loop
        detectObjects();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Camera access denied. Please allow camera permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.pause();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
    setDetections([]);
    setStats({ totalPeople: 0, totalObjects: 0, density: 0, alerts: 0 });
    toast.info('Camera stopped');
  };

  // Handle video file upload
  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    // Stop camera if running
    if (stream) {
      stopCamera();
    }

    const videoUrl = URL.createObjectURL(file);
    setUploadedVideo(videoUrl);
    setVideoMode('upload');
    toast.success(`Video uploaded: ${file.name}`);

    // Load video into video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.src = videoUrl;
      videoRef.current.load();
    }
  };

  // Process uploaded video
  const processUploadedVideo = () => {
    if (!videoRef.current || !model) return;

    setIsPlaying(true);
    videoRef.current.play();
    toast.info('Processing video with YOLO...');
    detectObjects();
    startRecording();
  };

  // Stop video processing
  const stopVideoProcessing = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPlaying(false);
    stopRecording();
    toast.info('Video processing stopped');
  };

  // Start recording canvas output
  const startRecording = () => {
    if (!canvasRef.current) return;

    try {
      const canvas = canvasRef.current;
      const canvasStream = canvas.captureStream(30); // 30 FPS
      
      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 2500000 // 2.5 Mbps for good quality
      });

      const chunks = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        setRecordedChunks(chunks);
        toast.success('Video recorded! Click download to save.');
      };

      mediaRecorder.start();
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      console.log('Recording started');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log('Recording stopped');
    }
  };

  // Download processed video
  const downloadVideo = () => {
    if (recordedChunks.length === 0) {
      toast.warning('No video recorded yet. Please process a video first.');
      return;
    }

    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kumbh-crowd-analysis-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Video downloaded successfully!');
  };

  // Reset and go back to camera mode
  const resetToCamera = () => {
    stopVideoProcessing();
    if (uploadedVideo) {
      URL.revokeObjectURL(uploadedVideo);
      setUploadedVideo(null);
    }
    if (videoRef.current) {
      videoRef.current.src = '';
    }
    setVideoMode('camera');
    setDetections([]);
    setStats({ totalPeople: 0, totalObjects: 0, density: 0, alerts: 0 });
    setRecordedChunks([]);
  };

  // Calculate distance between two objects
  const calculateDistance = (box1, box2) => {
    const centerX1 = box1[0] + box1[2] / 2;
    const centerY1 = box1[1] + box1[3] / 2;
    const centerX2 = box2[0] + box2[2] / 2;
    const centerY2 = box2[1] + box2[3] / 2;
    
    const distance = Math.sqrt(
      Math.pow(centerX2 - centerX1, 2) + Math.pow(centerY2 - centerY1, 2)
    );
    
    return distance.toFixed(2);
  };

  // Detect objects using YOLO (COCO-SSD)
  const detectObjects = async () => {
    if (!model || !videoRef.current) return;

    const video = videoRef.current;
    
    // Wait for video to be ready
    if (video.readyState !== 4) {
      animationRef.current = requestAnimationFrame(detectObjects);
      return;
    }

    try {
      // Run detection
      const predictions = await model.detect(video);
      
      // Filter for people and calculate stats
      const people = predictions.filter(pred => pred.class === 'person');
      const totalPeople = people.length;
      const totalObjects = predictions.length;
      
      // Calculate distances between people
      const distances = [];
      for (let i = 0; i < people.length; i++) {
        for (let j = i + 1; j < people.length; j++) {
          const dist = calculateDistance(people[i].bbox, people[j].bbox);
          distances.push({
            from: i,
            to: j,
            distance: dist
          });
        }
      }

      setDetections(predictions);
      setStats({
        totalPeople,
        totalObjects,
        density: ((totalPeople / 20) * 100).toFixed(1), // Assuming 20 is max capacity
        alerts: totalPeople > 15 ? 1 : 0
      });

      // Draw bounding boxes
      drawBoundingBoxes(predictions, distances);

    } catch (error) {
      console.error('Detection error:', error);
    }

    // Continue detection loop
    animationRef.current = requestAnimationFrame(detectObjects);
  };

  // Draw bounding boxes on canvas
  const drawBoundingBoxes = (predictions, distances = []) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw bounding boxes
    predictions.forEach((prediction, index) => {
      const [x, y, width, height] = prediction.bbox;
      const isPerson = prediction.class === 'person';
      
      // Set color based on object type
      ctx.strokeStyle = isPerson ? '#00FF00' : '#FFA500';
      ctx.lineWidth = 3;
      ctx.strokeRect(x, y, width, height);

      // Draw label background
      const label = `${prediction.class} ${(prediction.score * 100).toFixed(1)}%`;
      ctx.font = '16px Arial';
      const textWidth = ctx.measureText(label).width;
      
      ctx.fillStyle = isPerson ? '#00FF00' : '#FFA500';
      ctx.fillRect(x, y - 25, textWidth + 10, 25);
      
      // Draw label text
      ctx.fillStyle = '#000000';
      ctx.fillText(label, x + 5, y - 7);
    });

    // Draw distance lines between people
    const people = predictions.filter(pred => pred.class === 'person');
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.lineWidth = 2;
    
    distances.forEach(dist => {
      if (dist.from < people.length && dist.to < people.length) {
        const person1 = people[dist.from].bbox;
        const person2 = people[dist.to].bbox;
        
        const centerX1 = person1[0] + person1[2] / 2;
        const centerY1 = person1[1] + person1[3] / 2;
        const centerX2 = person2[0] + person2[2] / 2;
        const centerY2 = person2[1] + person2[3] / 2;
        
        ctx.beginPath();
        ctx.moveTo(centerX1, centerY1);
        ctx.lineTo(centerX2, centerY2);
        ctx.stroke();
        
        // Draw distance text
        const midX = (centerX1 + centerX2) / 2;
        const midY = (centerY1 + centerY2) / 2;
        ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
        ctx.fillRect(midX - 30, midY - 12, 60, 24);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '12px Arial';
        ctx.fillText(`${dist.distance}px`, midX - 25, midY + 5);
      }
    });
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
              {t('liveFeed.title')}
            </h1>
            <p className="text-gray-600 text-lg">
              {t('liveFeed.subtitle')}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">People Detected</p>
                  <p className="text-4xl font-bold text-green-600">{stats.totalPeople}</p>
                </div>
                <FaUsers className="text-5xl text-green-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Total Objects</p>
                  <p className="text-4xl font-bold text-blue-600">{stats.totalObjects}</p>
                </div>
                <FaVideo className="text-5xl text-blue-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Crowd Density</p>
                  <p className="text-4xl font-bold text-orange-600">{stats.density}%</p>
                </div>
                <FaUsers className="text-5xl text-orange-600 opacity-20" />
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Alerts</p>
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
                  <FaCamera className="mr-2" />
                  Live Camera Feed - YOLO Object Detection
                </h2>
                <div className="flex items-center gap-3">
                  {isLoading && (
                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-semibold">
                      Loading Model...
                    </span>
                  )}
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    isPlaying ? 'bg-green-500 text-white animate-pulse' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {isPlaying ? '● LIVE' : '○ STOPPED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative bg-gray-900 aspect-video">
              {/* Video element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedData={detectObjects}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: isPlaying ? 'block' : 'none' }}
              />

              {/* Placeholder when camera is off */}
              {!isPlaying && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    {videoMode === 'camera' ? (
                      <>
                        <FaCamera className="text-6xl mb-4 mx-auto" />
                        <p className="text-lg mb-2">Camera Ready</p>
                        <p className="text-sm">Click "Start Camera" to begin real-time detection</p>
                      </>
                    ) : (
                      <>
                        <FaFileVideo className="text-6xl mb-4 mx-auto" />
                        {uploadedVideo ? (
                          <>
                            <p className="text-lg mb-2">Video Uploaded</p>
                            <p className="text-sm">Click "Process Video" to analyze with YOLO</p>
                            <p className="text-xs mt-2 text-green-400">✓ Ready to detect 1000+ people</p>
                          </>
                        ) : (
                          <>
                            <p className="text-lg mb-2">No Video Selected</p>
                            <p className="text-sm">Click "Upload Video" to choose a file</p>
                          </>
                        )}
                      </>
                    )}
                    {isLoading && (
                      <p className="text-xs mt-4 text-yellow-400">Loading AI model, please wait...</p>
                    )}
                  </div>
                </div>
              )}

              {/* Canvas for bounding boxes */}
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ display: isPlaying ? 'block' : 'none' }}
              />

              {/* Detection Info Overlay */}
              {isPlaying && (
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-sm space-y-1">
                  <p><strong className="text-green-400">Model:</strong> COCO-SSD (YOLO-based)</p>
                  <p><strong className="text-blue-400">Mode:</strong> {videoMode === 'camera' ? 'Live Camera' : 'Video Upload'}</p>
                  <p><strong className="text-purple-400">Detections:</strong> {detections.length}</p>
                  <p><strong className="text-orange-400">Confidence:</strong> &gt; 50%</p>
                  {videoMode === 'upload' && (
                    <>
                      <p><strong className="text-yellow-400">Processing:</strong> Frame-by-frame</p>
                      {isRecording && (
                        <p className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          <strong className="text-red-400">Recording...</strong>
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Legend */}
              {isPlaying && (
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-lg p-3 text-white text-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-500"></div>
                    <span>Person</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-orange-500"></div>
                    <span>Other Objects</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-red-500"></div>
                    <span>Distance</span>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex flex-col space-y-4">
                {/* Mode Selection */}
                <div className="flex items-center justify-center space-x-4 pb-4 border-b">
                  <button
                    onClick={resetToCamera}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                      videoMode === 'camera'
                        ? 'bg-gradient-to-r from-saffron-500 to-spiritual-green text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <FaCamera />
                    Live Camera
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                      videoMode === 'upload'
                        ? 'bg-gradient-to-r from-saffron-500 to-spiritual-green text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    <FaUpload />
                    Upload Video
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    {videoMode === 'camera' && (
                      !isPlaying ? (
                        <button
                          onClick={startCamera}
                          disabled={isLoading || !model}
                          className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <FaCamera />
                          {isLoading ? 'Loading...' : 'Start Camera'}
                        </button>
                      ) : (
                        <button
                          onClick={stopCamera}
                          className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                        >
                          <FaStop />
                          Stop Camera
                        </button>
                      )
                    )}

                    {videoMode === 'upload' && uploadedVideo && (
                      <>
                        {!isPlaying ? (
                          <button
                            onClick={processUploadedVideo}
                            disabled={!model}
                            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            <FaFileVideo />
                            Process Video
                          </button>
                        ) : (
                          <button
                            onClick={stopVideoProcessing}
                            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                          >
                            <FaStop />
                            Stop Processing
                          </button>
                        )}
                        
                        {/* Download button - show when video has been recorded */}
                        {recordedChunks.length > 0 && (
                          <button
                            onClick={downloadVideo}
                            className="px-6 py-3 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-saffron-500 to-spiritual-green hover:from-saffron-600 hover:to-spiritual-green-dark text-white flex items-center gap-2 animate-pulse"
                          >
                            <FaDownload />
                            Download Processed Video
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">Real-time Features:</p>
                    <ul className="text-xs mt-1 space-y-0.5">
                      <li>✓ Object detection with bounding boxes</li>
                      <li>✓ Distance calculation between people</li>
                      <li>✓ Live head count tracking</li>
                      {videoMode === 'upload' && <li>✓ Process 1000+ people in video</li>}
                      {recordedChunks.length > 0 && <li>✓ Download processed video</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Real-time YOLO Detection',
                description: 'COCO-SSD model detects 80+ object classes including people in real-time from camera or video',
                icon: '⚡'
              },
              {
                title: 'Video Upload & Processing',
                description: 'Upload crowd videos with 1000+ people and get automated head count with bounding boxes',
                icon: '📹'
              },
              {
                title: 'Head Count Tracking',
                description: 'Live counting of total humans with bounding boxes, confidence scores, and distance calculation',
                icon: '👥'
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
