const defraAirQuality = require('../app');

// Find a specific station based on the name
defraAirQuality.findByName('Rochester Stoke').then(console.log);
