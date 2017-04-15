const defraAirQuality = require('../app');

// Find a specific station based on the name
defraAirQuality.findByName('Auchencorth Moss').then(console.log);
