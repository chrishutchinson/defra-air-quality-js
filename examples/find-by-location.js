const defraAirQuality = require('../app');

// Find a station based on latitude and longitude
defraAirQuality.findByNearestLocation(51.501476, -0.140634).then(console.log);
