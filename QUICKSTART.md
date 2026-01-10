# 🚀 Quick Start Guide

## Prerequisites Checklist
- [ ] Node.js v18+ installed
- [ ] npm or yarn installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Installation Steps

### 1. Clone or Navigate to Project
```bash
cd "c:\Users\Kunal Ramesh Pawar\OneDrive\Desktop\Khumbathon"
```

### 2. All dependencies are already installed! ✅

## Running the Application

### Option 1: Run Everything Together (Recommended)
```bash
npm run dev
```
This will start:
- Frontend on http://localhost:3000
- Backend on http://localhost:5000

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## Access the Application

🌐 **Frontend**: http://localhost:3000
🔌 **Backend API**: http://localhost:5000
📡 **WebSocket**: ws://localhost:5000

## First Time Setup

### Create Environment Files

**Frontend** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SOCKET_URL=http://localhost:5000
```

**Backend** (`server/.env`):
```env
PORT=5000
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

## Features to Test

1. **Home Page** - Dashboard with live stats
2. **Heatmap** - Click on different zones
3. **Safe Route** - Select start and end points
4. **Prediction** - View crowd forecasts
5. **Live Feed** - Click play to start detection

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

### Clear Cache and Reinstall
```bash
# Frontend
cd client
rm -rf node_modules package-lock.json
npm install

# Backend
cd ../server
rm -rf node_modules package-lock.json
npm install
```

## Project Structure
```
Khumbathon/
├── client/              # React Frontend
│   ├── src/
│   │   ├── components/  # React Components
│   │   ├── context/     # Context API
│   │   ├── App.js       # Main App
│   │   └── index.js     # Entry Point
│   └── public/          # Static Files
├── server/              # Node.js Backend
│   ├── routes/          # API Routes
│   └── index.js         # Server Entry
└── package.json         # Root Config
```

## Development Tips

- Frontend auto-reloads on file changes
- Backend restarts automatically with nodemon
- Check browser console for errors
- Check terminal for server logs

## Next Steps

1. ✅ Test all features
2. 🎨 Customize theme colors
3. 🔌 Add real YOLO model integration
4. 🌐 Deploy to production
5. 📱 Build mobile app version

## Support

Need help? Check:
- README.md for full documentation
- Console logs for errors
- API endpoints at http://localhost:5000/api

---

**Happy Coding! 🎉**
