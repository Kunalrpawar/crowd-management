const mongoose = require('mongoose');
const Parking = require('./models/Parking');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/kumbh-mela';

const parkingData = [
  // Prayagraj
  { name: 'Sangam Parking Zone A', location: 'prayagraj', coordinates: { lat: 25.4408, lng: 81.8513 }, type: 'multi', capacity: 1500, occupied: 900 },
  { name: 'Sangam Parking Zone B', location: 'prayagraj', coordinates: { lat: 25.4308, lng: 81.8513 }, type: 'multi', capacity: 1200, occupied: 800 },
  { name: 'Triveni Parking', location: 'prayagraj', coordinates: { lat: 25.4258, lng: 81.8403 }, type: 'car', capacity: 800, occupied: 500 },
  { name: 'Parade Ground Parking', location: 'prayagraj', coordinates: { lat: 25.4458, lng: 81.8543 }, type: 'bus', capacity: 300, occupied: 200 },
  { name: 'Sector 1 Parking', location: 'prayagraj', coordinates: { lat: 25.4158, lng: 81.8313 }, type: 'multi', capacity: 2000, occupied: 1400 },
  { name: 'Sector 2 Parking', location: 'prayagraj', coordinates: { lat: 25.4558, lng: 81.8613 }, type: 'multi', capacity: 1800, occupied: 1200 },
  { name: 'Two Wheeler Zone A', location: 'prayagraj', coordinates: { lat: 25.4438, lng: 81.8363 }, type: 'bike', capacity: 3000, occupied: 2000 },
  { name: 'Two Wheeler Zone B', location: 'prayagraj', coordinates: { lat: 25.4278, lng: 81.8563 }, type: 'bike', capacity: 2500, occupied: 1800 },
  { name: 'Bus Terminal Parking', location: 'prayagraj', coordinates: { lat: 25.4508, lng: 81.8343 }, type: 'bus', capacity: 500, occupied: 350 },
  { name: 'VIP Parking Zone', location: 'prayagraj', coordinates: { lat: 25.4238, lng: 81.8363 }, type: 'car', capacity: 200, occupied: 150 },
  
  // Haridwar
  { name: 'Har Ki Pauri Parking', location: 'haridwar', coordinates: { lat: 29.9457, lng: 78.1642 }, type: 'multi', capacity: 1000, occupied: 700 },
  { name: 'Brahma Kund Parking', location: 'haridwar', coordinates: { lat: 29.9537, lng: 78.1722 }, type: 'car', capacity: 600, occupied: 400 },
  { name: 'Mansa Devi Parking', location: 'haridwar', coordinates: { lat: 29.9857, lng: 78.1752 }, type: 'multi', capacity: 1500, occupied: 1000 },
  { name: 'Chandi Devi Parking', location: 'haridwar', coordinates: { lat: 30.0057, lng: 78.1892 }, type: 'multi', capacity: 1200, occupied: 800 },
  { name: 'Two Wheeler Zone', location: 'haridwar', coordinates: { lat: 29.9377, lng: 78.1722 }, type: 'bike', capacity: 2000, occupied: 1400 },
  { name: 'Bus Terminal', location: 'haridwar', coordinates: { lat: 29.9577, lng: 78.1542 }, type: 'bus', capacity: 400, occupied: 300 },
  { name: 'Railway Station Parking', location: 'haridwar', coordinates: { lat: 29.9307, lng: 78.1522 }, type: 'multi', capacity: 1800, occupied: 1200 },
  { name: 'ISBT Parking', location: 'haridwar', coordinates: { lat: 29.9637, lng: 78.1792 }, type: 'bus', capacity: 600, occupied: 400 },
  
  // Nashik
  { name: 'Ramkund Main Parking', location: 'nashik', coordinates: { lat: 19.9975, lng: 73.7898 }, type: 'multi', capacity: 1200, occupied: 900 },
  { name: 'Panchavati Parking', location: 'nashik', coordinates: { lat: 20.0075, lng: 73.7998 }, type: 'car', capacity: 800, occupied: 550 },
  { name: 'Sita Gufa Parking', location: 'nashik', coordinates: { lat: 19.9895, lng: 73.7818 }, type: 'multi', capacity: 600, occupied: 400 },
  { name: 'Kalaram Temple Parking', location: 'nashik', coordinates: { lat: 20.0055, lng: 73.8018 }, type: 'car', capacity: 500, occupied: 350 },
  { name: 'Two Wheeler Zone A', location: 'nashik', coordinates: { lat: 19.9875, lng: 73.7978 }, type: 'bike', capacity: 2500, occupied: 1800 },
  { name: 'Two Wheeler Zone B', location: 'nashik', coordinates: { lat: 20.0095, lng: 73.7798 }, type: 'bike', capacity: 2000, occupied: 1500 },
  { name: 'Bus Stand Parking', location: 'nashik', coordinates: { lat: 19.9825, lng: 73.7778 }, type: 'bus', capacity: 350, occupied: 250 },
  { name: 'Trimbak Road Parking', location: 'nashik', coordinates: { lat: 19.9375, lng: 73.5298 }, type: 'multi', capacity: 1500, occupied: 1000 },
  { name: 'Gangapur Road Parking', location: 'nashik', coordinates: { lat: 19.9775, lng: 73.7698 }, type: 'multi', capacity: 1000, occupied: 700 },
  { name: 'Tapovan Parking', location: 'nashik', coordinates: { lat: 20.0125, lng: 73.8048 }, type: 'car', capacity: 400, occupied: 280 },
  
  // Ujjain
  { name: 'Ram Ghat Parking', location: 'ujjain', coordinates: { lat: 23.1765, lng: 75.7885 }, type: 'multi', capacity: 1000, occupied: 700 },
  { name: 'Mahakaleshwar Parking', location: 'ujjain', coordinates: { lat: 23.1825, lng: 75.7685 }, type: 'multi', capacity: 1500, occupied: 1100 },
  { name: 'Harsiddhi Temple Parking', location: 'ujjain', coordinates: { lat: 23.1785, lng: 75.7905 }, type: 'car', capacity: 400, occupied: 280 },
  { name: 'Kal Bhairav Parking', location: 'ujjain', coordinates: { lat: 23.1805, lng: 75.7925 }, type: 'car', capacity: 300, occupied: 200 },
  { name: 'Two Wheeler Zone', location: 'ujjain', coordinates: { lat: 23.1685, lng: 75.7965 }, type: 'bike', capacity: 2000, occupied: 1400 },
  { name: 'Bus Terminal', location: 'ujjain', coordinates: { lat: 23.1865, lng: 75.7805 }, type: 'bus', capacity: 400, occupied: 300 },
  { name: 'Railway Station Parking', location: 'ujjain', coordinates: { lat: 23.1645, lng: 75.7785 }, type: 'multi', capacity: 1200, occupied: 850 },
  { name: 'Mangalnath Parking', location: 'ujjain', coordinates: { lat: 23.1995, lng: 75.7665 }, type: 'car', capacity: 500, occupied: 350 }
];

async function seedParking() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Clear existing data
    await Parking.deleteMany({});
    console.log('Cleared existing parking data');
    
    // Insert new data
    await Parking.insertMany(parkingData);
    console.log(`Inserted ${parkingData.length} parking zones`);
    
    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedParking();
