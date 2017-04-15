const loadData = require('./helpers/load-data');

/**
 * Return a list of all the stations
 */
module.exports.list = loadData;

/**
 * Find a sepcific status by name
 */
module.exports.findByName = name => {
  return loadData().then(items => {
    return items.find(item => {
      return item.title === name;
    });
  });
};

/**
 * Find the nearest station based on latitude and longitude
 */
module.exports.findByNearestLocation = (lat, long) => {
  // Get the data
  return loadData().then(
    items =>
      items
        .map(item => {
          const distanceFromSuppliedLocation = Math.sqrt(
            Math.pow(lat - item.location.latitude, 2) +
              Math.pow(long - item.location.longitude, 2)
          );

          return Object.assign({}, item, {
            distanceFromSuppliedLocation,
          });
        })
        // Sort the stations by distance (closest first)
        .sort((a, b) => {
          if (a.distanceFromSuppliedLocation < b.distanceFromSuppliedLocation)
            return -1;
          if (a.distanceFromSuppliedLocation > b.distanceFromSuppliedLocation)
            return 1;
          return 0;
        })
        // Take the first location, as this will be the closest.
        .slice(0, 1)[0]
  );
};
