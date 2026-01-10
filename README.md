#  Kumbh Mela Crowd Management System


---

##  Overview

The Kumbh Mela Crowd Management System is a comprehensive full-stack application designed to ensure safety and efficient crowd management for millions of pilgrims. Built with modern technologies including React, Node.js, AI/ML models (YOLO), and real-time WebSocket communication.

###  Key Highlights

-  **Real-time Crowd Heatmap** - Live visualization of crowd density across all zones
-  **AI-Powered Safe Routes** - Intelligent route suggestions avoiding congested areas
-  **Emergency Alert System** - Instant notifications for critical situations
-  **Crowd Prediction** - ML-based forecasting for better planning
-  **Live Video Feed** - YOLO-powered people detection and counting
-  **Beautiful UI/UX** - Modern, responsive design with Kumbh Mela theme

---

##  Features

### 1. Live Crowd Heatmap 

- **Real-time density visualization** using interactive maps
- Color-coded zones (Green → Yellow → Red → Critical)
- Click on zones for detailed information
- Historical crowd data tracking
- **Technologies**: React Leaflet, OpenStreetMap

### 2. Safe Route Planner 

- AI-powered route suggestions
- Avoid crowded areas automatically
- Multiple route alternatives
- Distance, time, and safety score calculations
- Visual route display on interactive map
- **Technologies**: Leaflet.js, custom routing algorithm

### 3. Emergency Alert System 

- Real-time alert notifications
- Priority-based alert types (Critical, Warning, Info)
- Location-specific alerts
- Auto-dismiss and manual dismiss options
- Alert history tracking
- **Technologies**: Socket.io, React Toastify

### 4. Crowd Prediction & Analytics 

- AI/ML-based crowd forecasting
- 24h, 48h, and 7-day predictions
- Zone-wise predictions
- Peak hours identification
- Risk assessment charts
- Interactive visualizations
- **Technologies**: Chart.js, custom ML integration

### 5. Live Video Feed with AI Detection 

- Real-time YOLO-based people detection
- Bounding box visualization
- Accurate people counting
- Confidence score display
- Multiple camera feeds support
- **Technologies**: YOLOv8, Canvas API, WebSockets

### 6. Beautiful Dashboard 

- Real-time statistics
- Quick insights and metrics
- Recent updates feed
- Responsive design for all devices
- **Technologies**: Tailwind CSS, Framer Motion

---

##  Installation

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



** Star this repo if you find it helpful! **

Made with  for the safety of millions

</div>
