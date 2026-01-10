import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';
import './i18n/i18n';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Dashboard from './components/Dashboard';
import CrowdHeatmap from './components/CrowdHeatmap';
import SafeRoute from './components/SafeRoute';
import EmergencyAlert from './components/EmergencyAlert';
import CrowdPrediction from './components/CrowdPrediction';
import LiveVideoFeed from './components/LiveVideoFeed';
import LostFound from './components/LostFound';
import MedicalEmergency from './components/MedicalEmergency';
import Weather from './components/Weather';
import Footer from './components/Footer';

// Context
import { SocketContext } from './context/SocketContext';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

function App() {
  const [socket, setSocket] = useState(null);
  const [emergencyAlerts, setEmergencyAlerts] = useState([]);
  const [crowdData, setCrowdData] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const socketConnection = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10
    });

    socketConnection.on('connect', () => {
      console.log('Connected to server');
    });

    socketConnection.on('crowdUpdate', (data) => {
      setCrowdData(data);
    });

    socketConnection.on('emergencyAlert', (alert) => {
      setEmergencyAlerts(prev => [alert, ...prev].slice(0, 5));
    });

    socketConnection.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    setSocket(socketConnection);

    return () => {
      socketConnection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <Router>
        <div className="App min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
          <Navbar />
          
          {/* Emergency Alerts Banner */}
          {emergencyAlerts.length > 0 && (
            <EmergencyAlert alerts={emergencyAlerts} onClose={(id) => 
              setEmergencyAlerts(prev => prev.filter(alert => alert.id !== id))
            } />
          )}

          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <Dashboard crowdData={crowdData} />
              </>
            } />
            <Route path="/heatmap" element={<CrowdHeatmap />} />
            <Route path="/safe-route" element={<SafeRoute />} />
            <Route path="/prediction" element={<CrowdPrediction />} />
            <Route path="/live-feed" element={<LiveVideoFeed />} />
            <Route path="/lost-found" element={<LostFound />} />
            <Route path="/medical" element={<MedicalEmergency />} />
            <Route path="/weather" element={<Weather />} />
          </Routes>

          <Footer />

          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </SocketContext.Provider>
  );
}

export default App;
