const defraAirQuality = require('../app');

// List all stations
defraAirQuality
  .list()
  .then(console.log)
  .catch(err => console.log('[ERR]', err));
