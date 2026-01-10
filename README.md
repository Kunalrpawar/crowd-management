# 🕉️ Kumbh Mela Crowd Management System

<div align="center">

![Kumbh Mela](https://img.shields.io/badge/Kumbh%20Mela-2025-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A cutting-edge AI-powered crowd management system for the world's largest religious gathering**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api-documentation)

</div>

---

## 🌟 Overview

The Kumbh Mela Crowd Management System is a comprehensive full-stack application designed to ensure safety and efficient crowd management for millions of pilgrims. Built with modern technologies including React, Node.js, AI/ML models (YOLO), and real-time WebSocket communication.

### 🎯 Key Highlights

- 🗺️ **Real-time Crowd Heatmap** - Live visualization of crowd density across all zones
- 🛣️ **AI-Powered Safe Routes** - Intelligent route suggestions avoiding congested areas
- 🚨 **Emergency Alert System** - Instant notifications for critical situations
- 📊 **Crowd Prediction** - ML-based forecasting for better planning
- 📹 **Live Video Feed** - YOLO-powered people detection and counting
- 🎨 **Beautiful UI/UX** - Modern, responsive design with Kumbh Mela theme

---

## ✨ Features

### 1. Live Crowd Heatmap 🗺️

- **Real-time density visualization** using interactive maps
- Color-coded zones (Green → Yellow → Red → Critical)
- Click on zones for detailed information
- Historical crowd data tracking
- **Technologies**: React Leaflet, OpenStreetMap

### 2. Safe Route Planner 🛣️

- AI-powered route suggestions
- Avoid crowded areas automatically
- Multiple route alternatives
- Distance, time, and safety score calculations
- Visual route display on interactive map
- **Technologies**: Leaflet.js, custom routing algorithm

### 3. Emergency Alert System 🚨

- Real-time alert notifications
- Priority-based alert types (Critical, Warning, Info)
- Location-specific alerts
- Auto-dismiss and manual dismiss options
- Alert history tracking
- **Technologies**: Socket.io, React Toastify

### 4. Crowd Prediction & Analytics 📊

- AI/ML-based crowd forecasting
- 24h, 48h, and 7-day predictions
- Zone-wise predictions
- Peak hours identification
- Risk assessment charts
- Interactive visualizations
- **Technologies**: Chart.js, custom ML integration

### 5. Live Video Feed with AI Detection 📹

- Real-time YOLO-based people detection
- Bounding box visualization
- Accurate people counting
- Confidence score display
- Multiple camera feeds support
- **Technologies**: YOLOv8, Canvas API, WebSockets

### 6. Beautiful Dashboard 📱

- Real-time statistics
- Quick insights and metrics
- Recent updates feed
- Responsive design for all devices
- **Technologies**: Tailwind CSS, Framer Motion

---

## 🛠️ Tech Stack

### Frontend
```
React 18.2          - UI Framework
Tailwind CSS        - Styling & Design
Framer Motion       - Animations
Leaflet.js          - Interactive Maps
Chart.js            - Data Visualization
Socket.io Client    - Real-time Updates
React Router        - Navigation
React Icons         - Icon Library
Axios               - HTTP Client
```

### Backend
```
Node.js             - Runtime Environment
Express.js          - Web Framework
Socket.io           - WebSocket Server
CORS                - Cross-Origin Support
dotenv              - Environment Variables
```

### AI/ML Integration
```
YOLOv8              - Object Detection
Python (Optional)   - ML Model Hosting
TensorFlow/PyTorch  - Deep Learning
```

---

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/kumbh-mela-crowd-management.git
cd kumbh-mela-crowd-management
```

### Option 1: Install All Dependencies at Once

```bash
npm run install-all
```

### Option 2: Install Manually

#### Install Root Dependencies
```bash
npm install
```

#### Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

#### Install Backend Dependencies
```bash
cd server
npm install
cd ..
```

### Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd server
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
GOOGLE_MAPS_API_KEY=your_api_key_here
ML_MODEL_ENDPOINT=http://localhost:8000
```

---

## 🚀 Usage

### Development Mode

#### Run Both Frontend and Backend Concurrently
```bash
npm run dev
```

#### Run Frontend Only
```bash
npm run client
```

#### Run Backend Only
```bash
npm run server
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Socket.io**: ws://localhost:5000

---

## 📱 Pages & Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Hero section + Dashboard |
| `/heatmap` | Crowd Heatmap | Live crowd density visualization |
| `/safe-route` | Safe Route Planner | AI route suggestions |
| `/prediction` | Crowd Prediction | ML-based forecasting |
| `/live-feed` | Live Video Feed | YOLO detection demo |

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Crowd Management

```http
GET /api/crowd/zones
```
Get all crowd zones with current data

```http
GET /api/crowd/zones/:id
```
Get specific zone details

```http
GET /api/crowd/stats
```
Get overall crowd statistics

#### Route Planning

```http
POST /api/routes/calculate
```
Calculate safe route between two points

**Body:**
```json
{
  "start": { "lat": 25.4358, "lng": 81.8463 },
  "end": { "lat": 25.4288, "lng": 81.8403 }
}
```

```http
GET /api/routes/alternatives
```
Get alternative route suggestions

#### Alerts

```http
GET /api/alerts
```
Get all active alerts

```http
POST /api/alerts
```
Create new alert

**Body:**
```json
{
  "type": "warning",
  "title": "High Crowd Alert",
  "message": "Crowd density exceeding safe limits",
  "location": "Sangam Nose"
}
```

#### Predictions

```http
GET /api/predictions?hours=24
```
Get crowd predictions

```http
GET /api/predictions/zones/:id
```
Get zone-specific predictions

```http
GET /api/predictions/peak-hours
```
Get peak hours forecast

#### ML Detection

```http
POST /api/ml/detect
```
YOLO detection on image/video frame

```http
GET /api/ml/model-info
```
Get ML model information

```http
GET /api/ml/stats
```
Get detection statistics

---

## 🎨 Design Features

### Color Scheme (Kumbh Mela Theme)

```css
Saffron: #FF9933  /* Primary brand color */
White: #FFFFFF    /* Purity and peace */
Green: #138808    /* Spiritual growth */
```

### Animations

- ✨ Framer Motion for smooth page transitions
- 🌊 Floating elements on hero section
- 💫 Pulse animations for live indicators
- 🎭 Hover effects on interactive elements

### Responsive Design

- 📱 Mobile-first approach
- 💻 Tablet and desktop optimized
- 🖥️ Ultra-wide screen support

---

## 🔐 Security Features

- ✅ CORS protection
- ✅ Input validation
- ✅ Environment variable protection
- ✅ Rate limiting (recommended for production)
- ✅ Error handling and logging

---

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests
cd server
npm test
```

---

## 📊 Performance

- ⚡ React lazy loading for components
- 🚀 Code splitting for optimized bundles
- 💾 Efficient state management
- 📡 WebSocket for real-time updates
- 🎯 Optimized API calls

---

## 🌐 Deployment

### Frontend (Vercel/Netlify)

```bash
cd client
npm run build
# Deploy dist folder
```

### Backend (Heroku/Railway/AWS)

```bash
cd server
# Set environment variables
# Deploy using your platform's CLI
```

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.com
GOOGLE_MAPS_API_KEY=your_production_key
ML_MODEL_ENDPOINT=https://your-ml-api.com
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 Future Enhancements

- [ ] Integration with actual YOLO model API
- [ ] Mobile app (React Native)
- [ ] Admin dashboard for authorities
- [ ] SMS/WhatsApp alert integration
- [ ] Multi-language support
- [ ] Offline mode with PWA
- [ ] Historical data analytics
- [ ] Weather integration
- [ ] Traffic flow optimization
- [ ] 3D crowd visualization

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Cannot connect to WebSocket
```bash
# Check if backend is running
npm run server
# Verify port 5000 is available
```

**Issue**: Map not loading
```bash
# Check internet connection
# Verify Leaflet CSS is imported
# Check browser console for errors
```

**Issue**: Dependencies installation fails
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Created with ❤️ for Kumbh Mela 2025

---

## 📞 Support

For support, email support@kumbhmela.com or join our Slack channel.

---

## 🙏 Acknowledgments

- OpenStreetMap for map data
- Ultralytics for YOLO models
- React and Node.js communities
- All contributors and supporters

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

Made with 🕉️ for the safety of millions

</div>
