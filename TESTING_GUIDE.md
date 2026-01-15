# 🧪 Quick Testing Guide - New Features

## Before You Start

1. **Ensure servers are running:**
   ```bash
   # Terminal 1 - Backend
   cd server
   npm start
   
   # Terminal 2 - Frontend
   cd client
   npm start
   ```

2. **Login to the application:**
   - Visit: http://localhost:3000/login
   - Enter any email and password
   - Click "Sign In"

---

## ✅ Test 1: Medi-Tracker

### URL: http://localhost:3000/medi-tracker

### What to Test:

1. **Dashboard Tab** ✓
   - Check if you see 4 colored stat cards (beds, medicines, ambulances, facilities)
   - Verify bed capacity overview shows ICU, Emergency, and General beds
   - Look for critical alerts (low stock medicines)

2. **Bed Availability Tab** ✓
   - Switch to "Bed Availability" tab
   - Check overall bed status (total, available, occupied, reserved)
   - Verify progress bars for bed types
   - Should see last updated timestamp

3. **Medicine Inventory Tab** ✓
   - Click "Medicine Inventory" tab
   - Use search box to find "Paracetamol"
   - Filter by category (select "Pain Relief")
   - Check stock status indicators (Green/Yellow/Red)
   - Verify low stock items show red warning

4. **First Aid Guides Tab** ✓
   - Click "First Aid Guides" tab
   - Click any guide card (e.g., "Heat Stroke")
   - Modal should open with:
     - Symptoms list
     - Step-by-step instructions
     - Prevention tips
   - Close modal with X button

5. **Ambulances Tab** ✓
   - Click "Ambulances" tab
   - Verify stats (Available, Dispatched, Government, Private)
   - Check each ambulance card shows:
     - ID (AMB-001, PVT-001, etc.)
     - Status (Available/Dispatched)
     - Facility name
     - Type (Advanced/Basic Life Support)
     - Equipment list

### Expected Results:
- ✅ All tabs load without errors
- ✅ Data displays correctly
- ✅ Search and filters work
- ✅ Modal opens and closes smoothly
- ✅ Real-time updates every 10 seconds

---

## ✅ Test 2: Track Nashik

### URL: http://localhost:3000/track-nashik

### What to Test:

1. **Location Selection** ✓
   - Click "Prayagraj" button
   - Map should center on Prayagraj
   - Routes list should update

2. **Parvani Day Toggle** ✓
   - Click the big red/gray button at top
   - Should toggle between "PARVANI DAY ACTIVE" and "Normal Day"
   - Black routes should close when active
   - Alert message should appear
   - Routes list should refresh

3. **Stats Cards** ✓
   - Check 6 stat cards at top:
     - Open Routes (green)
     - Closed Routes (red)
     - Restricted Routes (yellow)
     - Snani Routes (blue)
     - Emergency Routes (purple)
     - Parking Zones (gray)

4. **Route Filtering** ✓
   - Click "Bathing Routes" filter button
   - Only snani (bathing) routes should show
   - Try "VIP", "Emergency", "Black Routes"
   - Click "All Routes" to reset

5. **Route Details** ✓
   - Click any route card from the list
   - Route should highlight on map (thicker line)
   - Details card should appear at bottom showing:
     - Start and end points
     - Distance and time
     - Status and crowd level
     - Facilities available
     - Restrictions

6. **Map Interaction** ✓
   - Routes shown as colored lines on map
   - Click route on map to see popup
   - Parking zones shown as circles
   - Click parking zone to see capacity info

7. **Parking Zones Section** ✓
   - Scroll down to "Parking Zones" section
   - Each zone shows:
     - Name and type
     - Capacity, occupied, available
     - Progress bar (Green/Orange/Red based on occupancy)
     - Vehicle types accepted

8. **Switch Locations** ✓
   - Click "Nashik" button
   - Map moves to Nashik
   - Routes change to Nashik routes
   - Should see "Private Ambulance Route"

### Expected Results:
- ✅ Map loads properly
- ✅ Routes display as colored lines
- ✅ Parvani toggle works correctly
- ✅ Filters update route list
- ✅ Route details show on selection
- ✅ Parking zones display capacity
- ✅ Location switching works smoothly

---

## ✅ Test 3: 3D Maps

### URL: http://localhost:3000/maps-3d

### What to Test:

1. **Location Selection** ✓
   - Click each location button (Prayagraj, Haridwar, Nashik, Ujjain)
   - Map should center on selected location
   - Building list should update
   - Stats should change

2. **View Mode Toggle** ✓
   - Click "2D Map View" button
   - Buildings show as markers
   - Click "3D Building View" button
   - Buildings show as colored rectangles with shadows

3. **Stats Cards** ✓
   - Check 4 stat cards:
     - Buildings count
     - Facilities count
     - Active Events count
     - Promotions count

4. **Search Functionality** ✓
   - Type "Medical" in search box
   - Only medical buildings should show
   - Clear search
   - All buildings return

5. **Category Filter** ✓
   - Select "hospital" from dropdown
   - Only hospitals should display
   - Try "food", "parking", "security"
   - Select "All Categories" to reset

6. **Building Interaction** ✓
   - Click any building card from list
   - Building should highlight on map
   - Details card should appear below map showing:
     - Building name and icon
     - Height, floors, width, length (in 3D mode)
     - Location coordinates

7. **3D Building View** ✓
   - Enable 3D mode
   - Buildings displayed as colored rectangles
   - Each building has a shadow (circle underneath)
   - Larger buildings have bigger rectangles
   - Colors match building types

8. **Facilities on Map** ✓
   - Blue circles on map = facilities
   - Click circle to see popup with:
     - Facility name and icon
     - Services provided

9. **Events Section** ✓
   - Check "Active Events" card at bottom
   - Events show:
     - Title and description
     - Date and time
     - Location

10. **Promotions Section** ✓
    - Check "Current Promotions" card
    - Promotions show:
      - Title and description
      - Active status

11. **Language Toggle** ✓
    - Click language button (top right of map)
    - Should toggle between English and Hindi
    - Interface updates language

### Expected Results:
- ✅ Map loads without errors
- ✅ 2D and 3D views work
- ✅ Buildings display correctly
- ✅ Search filters buildings
- ✅ Category filter works
- ✅ Building selection highlights
- ✅ Events and promotions display
- ✅ Language switching works

---

## 🔍 Common Issues & Solutions

### Issue 1: Map not loading
**Solution:** 
- Check browser console for errors
- Ensure leaflet CSS is loaded
- Refresh page (Ctrl+R)

### Issue 2: Data not displaying
**Solution:**
- Check if backend server is running on port 5000
- Open: http://localhost:5000/api/medical/bed-availability
- Should see JSON data
- If not, restart backend server

### Issue 3: Routes not updating
**Solution:**
- Check backend route in server/routes/track-nashik.js
- Ensure route is registered in server/index.js
- Restart backend server

### Issue 4: Components not found
**Solution:**
- Check all component files are created:
  - client/src/components/MediTracker.js
  - client/src/components/TrackNashik.js
  - client/src/components/Maps3D.js
- Check imports in App.js

### Issue 5: Navigation buttons not visible
**Solution:**
- Check Navbar.js has new navItems
- Check icons are imported (FaHospital, FaMapMarkedAlt, FaCube)
- Clear browser cache

---

## 📊 Feature Checklist

### Medi-Tracker:
- [ ] Dashboard loads
- [ ] Bed availability displays
- [ ] Medicine inventory works
- [ ] First aid guides open
- [ ] Ambulances tracked
- [ ] Search functions
- [ ] Filters work

### Track Nashik:
- [ ] Routes display on map
- [ ] Location switching works
- [ ] Parvani toggle functions
- [ ] Route types filter
- [ ] Parking zones show
- [ ] Route details appear
- [ ] Stats update

### 3D Maps:
- [ ] 2D view works
- [ ] 3D view displays rectangles
- [ ] Building search works
- [ ] Category filter functions
- [ ] Building details show
- [ ] Events display
- [ ] Promotions visible
- [ ] Language toggle works

---

## 🎯 Performance Checks

1. **Page Load Time:** Should load in < 3 seconds
2. **Map Rendering:** Smooth zoom and pan
3. **Real-time Updates:** Data refreshes every 10-15 seconds
4. **Search Response:** Instant filtering
5. **Mobile Responsive:** Works on phone screens

---

## 🚀 Next Steps

After successful testing:
1. ✅ All 3 features working
2. ✅ No console errors
3. ✅ Data displays correctly
4. ✅ Interactions smooth

**You're ready to demonstrate the system!**

---

## 📝 Test Results Template

```
Date: _____________
Tester: ___________

Medi-Tracker:       [ ] Pass  [ ] Fail
Track Nashik:       [ ] Pass  [ ] Fail
3D Maps:            [ ] Pass  [ ] Fail

Issues Found:
1. ___________________________________
2. ___________________________________
3. ___________________________________

Notes:
_____________________________________
_____________________________________
```

---

**Happy Testing! 🎉**