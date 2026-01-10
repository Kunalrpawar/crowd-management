const express = require('express');
const router = express.Router();

// Weather data storage (in production, integrate with actual weather API)
let currentWeather = {
  temperature: 22,
  feelsLike: 20,
  humidity: 65,
  windSpeed: 15,
  windDirection: 'NW',
  description: 'Partly Cloudy',
  icon: 'partly-cloudy',
  visibility: 8,
  uvIndex: 5,
  airQuality: 'Moderate',
  lastUpdated: new Date().toISOString()
};

// Weather alerts storage
let weatherAlerts = [];
let alertIdCounter = 1;

// Get current weather
router.get('/current', (req, res) => {
  try {
    // Simulate weather changes for demo
    currentWeather = {
      ...currentWeather,
      temperature: Math.round(18 + Math.random() * 12), // 18-30°C
      humidity: Math.round(50 + Math.random() * 30), // 50-80%
      windSpeed: Math.round(5 + Math.random() * 20), // 5-25 km/h
      lastUpdated: new Date().toISOString()
    };

    res.json({
      success: true,
      data: currentWeather,
      location: {
        city: 'Prayagraj',
        state: 'Uttar Pradesh',
        lat: 25.4358,
        lng: 81.8463
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weather data',
      error: error.message
    });
  }
});

// Get weather forecast (hourly and daily)
router.get('/forecast', (req, res) => {
  try {
    const { type } = req.query; // 'hourly' or 'daily'
    
    let forecast = [];
    
    if (type === 'hourly' || !type) {
      // Generate 24-hour forecast
      for (let i = 0; i < 24; i++) {
        const time = new Date();
        time.setHours(time.getHours() + i);
        
        forecast.push({
          time: time.toISOString(),
          hour: time.getHours(),
          temperature: Math.round(18 + Math.random() * 12),
          feelsLike: Math.round(16 + Math.random() * 12),
          humidity: Math.round(50 + Math.random() * 30),
          windSpeed: Math.round(5 + Math.random() * 20),
          chanceOfRain: Math.round(Math.random() * 40),
          description: getWeatherDescription(),
          icon: getWeatherIcon()
        });
      }
    }
    
    if (type === 'daily') {
      // Generate 7-day forecast
      forecast = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        
        forecast.push({
          date: date.toISOString().split('T')[0],
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          tempMin: Math.round(15 + Math.random() * 8),
          tempMax: Math.round(25 + Math.random() * 10),
          humidity: Math.round(50 + Math.random() * 30),
          windSpeed: Math.round(5 + Math.random() * 20),
          chanceOfRain: Math.round(Math.random() * 60),
          description: getWeatherDescription(),
          icon: getWeatherIcon(),
          sunrise: '06:45 AM',
          sunset: '06:15 PM'
        });
      }
    }

    res.json({
      success: true,
      type: type || 'hourly',
      count: forecast.length,
      data: forecast
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weather forecast',
      error: error.message
    });
  }
});

// Get weather alerts
router.get('/alerts', (req, res) => {
  try {
    const { active } = req.query;
    
    // Add some sample alerts if none exist
    if (weatherAlerts.length === 0) {
      weatherAlerts = generateSampleAlerts();
    }
    
    let filtered = [...weatherAlerts];
    
    if (active === 'true') {
      const now = new Date();
      filtered = filtered.filter(alert => 
        new Date(alert.validUntil) > now && alert.status === 'active'
      );
    }
    
    res.json({
      success: true,
      count: filtered.length,
      data: filtered.sort((a, b) => b.priority - a.priority)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weather alerts',
      error: error.message
    });
  }
});

// Create weather alert (for admin/automated system)
router.post('/alerts', (req, res) => {
  try {
    const {
      type,
      severity,
      title,
      message,
      validFrom,
      validUntil,
      affectedZones,
      recommendations
    } = req.body;

    if (!type || !severity || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Type, severity, title, and message are required'
      });
    }

    const alert = {
      id: alertIdCounter++,
      type, // rain, fog, heat, wind, storm, etc.
      severity, // low, medium, high, extreme
      priority: getSeverityPriority(severity),
      title,
      message,
      validFrom: validFrom || new Date().toISOString(),
      validUntil: validUntil || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      affectedZones: affectedZones || 'All zones',
      recommendations: recommendations || [],
      status: 'active',
      issuedAt: new Date().toISOString()
    };

    weatherAlerts.push(alert);

    res.json({
      success: true,
      message: 'Weather alert created successfully',
      data: alert
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating weather alert',
      error: error.message
    });
  }
});

// Get weather-based advisories for crowd management
router.get('/advisories', (req, res) => {
  try {
    const advisories = generateWeatherAdvisories(currentWeather);

    res.json({
      success: true,
      count: advisories.length,
      data: advisories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weather advisories',
      error: error.message
    });
  }
});

// Get weather impact on crowd movement
router.get('/crowd-impact', (req, res) => {
  try {
    const impact = calculateWeatherImpact(currentWeather);

    res.json({
      success: true,
      data: impact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error calculating weather impact',
      error: error.message
    });
  }
});

// Get best bathing times based on weather
router.get('/bathing-times', (req, res) => {
  try {
    const bathingTimes = generateBathingRecommendations(currentWeather);

    res.json({
      success: true,
      data: bathingTimes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching bathing times',
      error: error.message
    });
  }
});

// Get weather statistics
router.get('/stats', (req, res) => {
  try {
    const stats = {
      current: currentWeather,
      activeAlerts: weatherAlerts.filter(a => a.status === 'active').length,
      criticalAlerts: weatherAlerts.filter(a => a.severity === 'extreme' && a.status === 'active').length,
      avgTemperature: currentWeather.temperature,
      uvIndexLevel: getUVLevel(currentWeather.uvIndex),
      airQualityLevel: currentWeather.airQuality,
      visibilityStatus: currentWeather.visibility > 5 ? 'Good' : 'Poor',
      crowdImpact: calculateWeatherImpact(currentWeather).overallImpact
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching weather statistics',
      error: error.message
    });
  }
});

// Helper functions
function getWeatherDescription() {
  const descriptions = [
    'Clear Sky', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
    'Foggy', 'Sunny', 'Overcast', 'Misty'
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
}

function getWeatherIcon() {
  const icons = [
    'sun', 'partly-cloudy', 'cloudy', 'rain', 'fog', 'wind'
  ];
  return icons[Math.floor(Math.random() * icons.length)];
}

function getSeverityPriority(severity) {
  const priorities = {
    'low': 1,
    'medium': 2,
    'high': 3,
    'extreme': 4
  };
  return priorities[severity] || 1;
}

function getUVLevel(uvIndex) {
  if (uvIndex <= 2) return 'Low';
  if (uvIndex <= 5) return 'Moderate';
  if (uvIndex <= 7) return 'High';
  if (uvIndex <= 10) return 'Very High';
  return 'Extreme';
}

function generateSampleAlerts() {
  return [
    {
      id: alertIdCounter++,
      type: 'fog',
      severity: 'high',
      priority: 3,
      title: 'Dense Fog Alert',
      message: 'Dense fog expected in early morning hours. Visibility may drop below 50 meters.',
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      affectedZones: 'All riverside zones',
      recommendations: [
        'Avoid bathing during peak fog hours (4 AM - 8 AM)',
        'Use torches and stay in groups',
        'Follow designated paths only'
      ],
      status: 'active',
      issuedAt: new Date().toISOString()
    },
    {
      id: alertIdCounter++,
      type: 'heat',
      severity: 'medium',
      priority: 2,
      title: 'High Temperature Advisory',
      message: 'Temperature expected to reach 32°C during afternoon hours.',
      validFrom: new Date().toISOString(),
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      affectedZones: 'All zones',
      recommendations: [
        'Stay hydrated',
        'Avoid direct sunlight between 12 PM - 3 PM',
        'Wear light-colored clothing'
      ],
      status: 'active',
      issuedAt: new Date().toISOString()
    }
  ];
}

function generateWeatherAdvisories(weather) {
  const advisories = [];

  // Temperature-based advisories
  if (weather.temperature > 30) {
    advisories.push({
      type: 'heat',
      severity: 'high',
      message: 'High temperature alert. Stay hydrated and avoid prolonged sun exposure.',
      icon: '🌡️',
      recommendations: [
        'Drink water every 30 minutes',
        'Seek shade during peak hours',
        'Wear sunscreen and hats'
      ]
    });
  } else if (weather.temperature < 15) {
    advisories.push({
      type: 'cold',
      severity: 'medium',
      message: 'Cold weather. Elderly and children should take extra precautions.',
      icon: '❄️',
      recommendations: [
        'Wear warm clothing',
        'Avoid early morning bathing',
        'Keep blankets handy'
      ]
    });
  }

  // Humidity-based advisories
  if (weather.humidity > 80) {
    advisories.push({
      type: 'humidity',
      severity: 'medium',
      message: 'High humidity levels. May cause discomfort and difficulty breathing.',
      icon: '💧',
      recommendations: [
        'Stay in ventilated areas',
        'Take frequent breaks',
        'Monitor health conditions'
      ]
    });
  }

  // Wind-based advisories
  if (weather.windSpeed > 25) {
    advisories.push({
      type: 'wind',
      severity: 'high',
      message: 'Strong winds expected. Secure loose items and avoid open areas.',
      icon: '💨',
      recommendations: [
        'Avoid temporary structures',
        'Secure tents and belongings',
        'Be cautious near riverbanks'
      ]
    });
  }

  // Visibility-based advisories
  if (weather.visibility < 5) {
    advisories.push({
      type: 'visibility',
      severity: 'high',
      message: 'Poor visibility due to fog/mist. Exercise extreme caution.',
      icon: '🌫️',
      recommendations: [
        'Use flashlights',
        'Stay in groups',
        'Follow marked paths only'
      ]
    });
  }

  // UV Index advisories
  if (weather.uvIndex > 7) {
    advisories.push({
      type: 'uv',
      severity: 'medium',
      message: 'High UV index. Protect skin from harmful sun rays.',
      icon: '☀️',
      recommendations: [
        'Apply sunscreen regularly',
        'Wear protective clothing',
        'Use umbrellas or hats'
      ]
    });
  }

  return advisories;
}

function calculateWeatherImpact(weather) {
  let impact = {
    crowdMovement: 'Normal',
    bathingConditions: 'Favorable',
    visibility: 'Good',
    comfortLevel: 'Comfortable',
    overallImpact: 'Low',
    restrictions: []
  };

  let impactScore = 0;

  // Temperature impact
  if (weather.temperature > 35 || weather.temperature < 10) {
    impactScore += 3;
    impact.comfortLevel = 'Uncomfortable';
    impact.restrictions.push('Limited outdoor activities recommended');
  } else if (weather.temperature > 30 || weather.temperature < 15) {
    impactScore += 1;
    impact.comfortLevel = 'Moderate';
  }

  // Wind impact
  if (weather.windSpeed > 30) {
    impactScore += 3;
    impact.crowdMovement = 'Difficult';
    impact.restrictions.push('Avoid temporary structures');
  } else if (weather.windSpeed > 20) {
    impactScore += 2;
    impact.crowdMovement = 'Moderate';
  }

  // Visibility impact
  if (weather.visibility < 3) {
    impactScore += 3;
    impact.visibility = 'Poor';
    impact.bathingConditions = 'Not Recommended';
    impact.restrictions.push('Bathing not advised due to poor visibility');
  } else if (weather.visibility < 5) {
    impactScore += 2;
    impact.visibility = 'Moderate';
    impact.bathingConditions = 'Exercise Caution';
  }

  // Overall impact determination
  if (impactScore >= 7) {
    impact.overallImpact = 'Severe';
  } else if (impactScore >= 4) {
    impact.overallImpact = 'High';
  } else if (impactScore >= 2) {
    impact.overallImpact = 'Moderate';
  }

  return impact;
}

function generateBathingRecommendations(weather) {
  const recommendations = {
    bestTimes: [],
    avoidTimes: [],
    currentStatus: 'Favorable',
    safetyTips: []
  };

  // Morning slot
  if (weather.visibility > 5 && weather.temperature > 15) {
    recommendations.bestTimes.push({
      slot: '6:00 AM - 9:00 AM',
      reason: 'Good visibility and comfortable temperature',
      crowdLevel: 'High'
    });
  }

  // Afternoon slot
  if (weather.temperature < 32 && weather.uvIndex < 8) {
    recommendations.bestTimes.push({
      slot: '2:00 PM - 5:00 PM',
      reason: 'Moderate temperature and lower crowd',
      crowdLevel: 'Medium'
    });
  } else {
    recommendations.avoidTimes.push({
      slot: '12:00 PM - 3:00 PM',
      reason: 'High temperature and UV index',
      alternative: 'Consider evening bathing'
    });
  }

  // Evening slot
  if (weather.temperature > 18) {
    recommendations.bestTimes.push({
      slot: '5:00 PM - 7:00 PM',
      reason: 'Pleasant temperature and sunset views',
      crowdLevel: 'Medium'
    });
  }

  // Current status
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 9) {
    recommendations.currentStatus = weather.visibility > 5 ? 'Favorable' : 'Caution Advised';
  } else if (hour >= 12 && hour < 15) {
    recommendations.currentStatus = weather.temperature < 32 ? 'Favorable' : 'Too Hot';
  } else if (hour >= 17 && hour < 19) {
    recommendations.currentStatus = 'Favorable';
  } else {
    recommendations.currentStatus = 'Not Recommended';
  }

  // Safety tips
  recommendations.safetyTips = [
    'Always bathe in designated areas only',
    'Stay within marked safe zones',
    'Wear life jackets if not a strong swimmer',
    'Keep children under constant supervision',
    'Avoid bathing immediately after meals',
    'Be aware of river currents and depth'
  ];

  return recommendations;
}

module.exports = router;
