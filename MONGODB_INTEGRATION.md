# MongoDB Integration Documentation

## Overview
Complete MongoDB database integration for Kumbh Mela Crowd Management System. All user forms and data inputs now save to MongoDB Atlas.

## 🗄️ Database Setup

### Connection
- **Database**: MongoDB Atlas
- **Connection String**: Set in `server/.env` file
- **Configuration**: `server/config/database.js`

### Environment Variables
```env
MONGODB_URI=mongodb+srv://kunalrpawar04_db_user:NEW_PASSWORD@cluster0.pn3eqkx.mongodb.net/mydb?retryWrites=true&w=majority
```

## 📦 Mongoose Models Created

### 1. User Model (`server/models/User.js`)
Stores user profiles and authentication data.

**Fields:**
- name, email, password (hashed)
- phone, address, language
- pilgrimId (unique identifier)
- role (user/admin/medical/security)
- emergencyContact (name, phone, relation)
- visitedLocations[] (location history)
- eventsAttended[] (event participation)
- registrationDate, lastLogin

### 2. LostFound Model (`server/models/LostFound.js`)
Manages missing and found person reports.

**Fields:**
- reportedBy (User reference)
- type (missing/found)
- status (active/resolved/investigating)
- name, age, gender, description
- lastSeenLocation/currentLocation
- contactNumber, alternateContact
- clothingDescription, identificationMarks
- photo, location (geospatial coordinates)
- notes[], matchedWith (reference)

### 3. MedicalEmergency Model (`server/models/MedicalEmergency.js`)
Handles medical emergency requests.

**Fields:**
- reportedBy (User reference)
- patientName, age, gender
- condition, symptoms, severity
- status (pending/dispatched/treating/resolved)
- location (address + coordinates)
- contactNumber, alternateContact
- assignedTo (facility, ambulance, staff)
- vitals (bloodPressure, heartRate, temperature, oxygenLevel)
- medicalHistory (allergies, medications, conditions)
- responseTime (reported, dispatched, arrived, resolved)
- notes[], priority

### 4. MedicalFacility Model (`server/models/MedicalFacility.js`)
Stores medical facility information.

**Fields:**
- name, type (hospital/emergency/first-aid/pharmacy/trauma/mobile)
- location (address, city, coordinates)
- contact (phone, emergency, email)
- capacity (total, available, icu, general)
- facilities[], specialists[]
- availability (24x7/daytime/limited)
- status (operational/busy/full/emergency-only/closed)
- ambulances (total, available)

### 5. CrowdData Model (`server/models/CrowdData.js`)
Real-time crowd density tracking.

**Fields:**
- location (name, city, coordinates)
- crowdLevel (low/moderate/high/critical)
- density (people per sq meter)
- count (total people)
- trend (increasing/stable/decreasing)
- source (ai-camera/manual/sensor/estimated)
- alerts[]
- weather (temperature, humidity, condition)
- metadata (cameraId, accuracy, processingTime)

### 6. Alert Model (`server/models/Alert.js`)
System-wide alerts and notifications.

**Fields:**
- type (emergency/overcrowding/stampede/medical/lost-person/weather/security/traffic)
- severity (low/medium/high/critical)
- title, message
- location (name, city, coordinates)
- affectedArea (radius, zones[])
- status (active/acknowledged/resolved/expired)
- issuedBy (User reference)
- issuedAt, expiresAt, resolvedAt
- notificationsSent (sms, push, broadcast)
- relatedIncidents[], actions[]

### 7. Prediction Model (`server/models/Prediction.js`)
AI/ML predictions for crowd, weather, traffic.

**Fields:**
- location (name, city, coordinates)
- predictionType (crowd/weather/traffic/event)
- timeRange (start, end)
- predictions[] (timestamp, value, confidence, category)
- crowdPrediction (expectedCount, crowdLevel, peakTime, factors)
- weatherPrediction (temperature, humidity, rainfall, condition, windSpeed)
- trafficPrediction (congestionLevel, estimatedDelay)
- model (name, version, accuracy, lastTrained)
- confidence, factors[], recommendations[], alerts[]

### 8. Route Model (`server/models/Route.js`)
Safe routes and navigation paths.

**Fields:**
- name, city
- startLocation, endLocation (name, coordinates)
- waypoints[] (name, coordinates, order)
- path (LineString coordinates)
- distance (meters), estimatedTime (minutes)
- difficulty (easy/moderate/difficult)
- crowdLevel, accessibility (wheelchair, elderly, children)
- amenities[] (type, name, coordinates)
- conditions (isSafe, isOpen, trafficStatus)
- warnings[], recommendations[]
- popularity, rating

## 🛣️ API Endpoints Created

### User/Profile Routes (`/api/users/`)
```javascript
GET    /:id                    // Get user by ID
GET    /email/:email           // Get user by email
POST   /register               // Register new user
PUT    /:id                    // Update user profile
PATCH  /:id/login              // Update last login
POST   /:id/location           // Add visited location
POST   /:id/event              // Add attended event
GET    /:id/stats              // Get user statistics
DELETE /:id                    // Deactivate user (soft delete)
```

### Lost & Found Routes (`/api/lostfound/`)
```javascript
POST   /report-missing         // Report missing person
POST   /report-found           // Report found person
GET    /missing                // Get all missing persons
GET    /found                  // Get all found persons
GET    /case/:id               // Get case by ID
PATCH  /case/:id/status        // Update case status
GET    /stats                  // Get statistics
```

### Medical Emergency Routes (`/api/medical/`)
```javascript
POST   /emergency              // Submit emergency request
GET    /emergencies            // Get all emergencies
GET    /emergency/:id          // Get single emergency
PATCH  /emergency/:id/status   // Update emergency status
POST   /emergency/:id/note     // Add note to emergency
GET    /facilities             // Get all medical facilities
GET    /facility/:id           // Get single facility
POST   /facility               // Create/update facility
PATCH  /facility/:id/capacity  // Update facility capacity
GET    /facilities/nearby      // Get nearby facilities (geospatial)
GET    /stats                  // Get medical statistics
```

## 🎨 Frontend Integration

### Profile Component (`client/src/components/Profile.js`)
**Features:**
- ✅ Loads user profile from MongoDB
- ✅ Edit and save profile data
- ✅ Displays user statistics (locations visited, events attended, days at Kumbh)
- ✅ Real-time updates with loading states
- ✅ Beautiful UI with Framer Motion animations

**API Calls:**
```javascript
// Fetch user profile
GET /api/users/${userId}

// Update profile
PUT /api/users/${userId}
Body: { name, phone, address, language }

// Get statistics
GET /api/users/${userId}/stats
```

### Lost & Found Component (`client/src/components/LostFound.js`)
**Features:**
- ✅ Report missing persons - saves to MongoDB
- ✅ Report found persons - saves to MongoDB
- ✅ View all cases with pagination
- ✅ Automatic matching algorithm for missing/found pairs
- ✅ Real-time case updates

**API Integration:**
```javascript
// Report missing
POST /api/lostfound/report-missing
Body: { name, age, gender, description, lastSeenLocation, contactNumber, clothingDescription, identificationMarks }

// Report found
POST /api/lostfound/report-found
Body: { description, currentLocation, contactNumber, approximateAge, gender, clothingDescription }

// Fetch cases
GET /api/lostfound/missing
GET /api/lostfound/found
```

### Medical Emergency Component (`client/src/components/MedicalEmergency.js`)
**Features:**
- ✅ Submit emergency requests - saves to MongoDB
- ✅ View all emergencies by status and severity
- ✅ Track response times
- ✅ View medical facility availability
- ✅ Real-time emergency updates

**API Integration:**
```javascript
// Submit emergency
POST /api/medical/emergency
Body: { patientName, age, gender, condition, symptoms, severity, location, contactNumber }

// Fetch emergencies
GET /api/medical/emergencies?status=pending&severity=critical

// Get facilities
GET /api/medical/facilities?type=hospital
```

## 🚀 Installation & Setup

### 1. Install Dependencies
```bash
cd server
npm install mongoose bcrypt jsonwebtoken
```

### 2. Configure Environment
Create/update `server/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
PORT=5000
```

### 3. Start Server
```bash
cd server
npm start
```

The server will automatically connect to MongoDB on startup.

## 📊 Database Indexes

For optimal performance, the following indexes are automatically created:

**User Model:**
- email (unique)
- pilgrimId (unique)

**LostFound Model:**
- type + status (compound)
- reportedAt (descending)
- location (2dsphere geospatial)

**MedicalEmergency Model:**
- status + severity (compound)
- location.coordinates (2dsphere geospatial)
- responseTime.reported (descending)

**MedicalFacility Model:**
- location.coordinates (2dsphere geospatial)
- type + status (compound)

**CrowdData Model:**
- timestamp (descending)
- location.city + timestamp (compound)
- location.coordinates (2dsphere geospatial)

## 🔐 Security Notes

**Important:** In production, implement:
1. ✅ Password hashing with bcrypt (model ready)
2. ⚠️ JWT authentication middleware (to be added)
3. ⚠️ Input validation and sanitization (partially implemented)
4. ⚠️ Rate limiting (to be added)
5. ⚠️ CORS configuration (basic setup done)

## 📝 Sample Data Creation

To populate the database with sample data, you can use MongoDB Compass or create a seed script:

```javascript
// Example: Creating a sample user
POST /api/users/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+91 9876543210",
  "address": "Prayagraj, UP",
  "language": "English"
}
```

## 🧪 Testing

Test the API endpoints using:
- **Postman** or **Thunder Client**
- **MongoDB Compass** for database inspection
- **Frontend forms** (all connected to backend)

### Test URLs:
```
Backend:  http://localhost:5000
Frontend: http://localhost:3000
Health:   http://localhost:5000/api/health
```

## ✅ Completed Features

1. ✅ MongoDB connection setup
2. ✅ 8 Mongoose models created
3. ✅ User/Profile CRUD routes
4. ✅ Lost & Found with matching algorithm
5. ✅ Medical Emergency with geospatial queries
6. ✅ Medical Facility management
7. ✅ Crowd data tracking models
8. ✅ Alert system models
9. ✅ Prediction system models
10. ✅ Route management models
11. ✅ Frontend Profile page integrated
12. ✅ All form submissions save to MongoDB

## 📚 Next Steps (Recommendations)

1. **Authentication**: Implement JWT-based auth
2. **Image Upload**: Add Cloudinary/S3 for photos
3. **Real-time Sync**: Use Socket.IO for live updates
4. **Data Validation**: Add express-validator
5. **API Documentation**: Generate Swagger docs
6. **Testing**: Add Jest/Mocha tests
7. **Caching**: Implement Redis for frequently accessed data
8. **Backup**: Set up automated MongoDB backups

## 🐛 Troubleshooting

**Connection Issues:**
- Verify MongoDB URI in `.env`
- Check network access in MongoDB Atlas
- Ensure IP whitelist includes your IP

**Model Errors:**
- Check required fields in requests
- Verify data types match schema
- Review console logs for validation errors

**API Not Working:**
- Confirm server is running on port 5000
- Check CORS settings if frontend can't connect
- Use browser DevTools Network tab to inspect requests

---

**Database Status:** ✅ Fully Operational
**All Forms:** ✅ Connected to MongoDB
**Data Persistence:** ✅ Enabled

Last Updated: January 15, 2026
