# Defra UK Air Quality data formatter

> A Node.js library for scraping, formatting and returning Defra Air Quality data

[![Build Status](https://travis-ci.org/chrishutchinson/defra-air-quality-js.svg?branch=master)](https://travis-ci.org/chrishutchinson/defra-air-quality-js)

## About

This library exposes a full, formatted list of air quality measurement stations around the UK, and helper methods for finding specific stations based on name or location.


## Installation

    $ npm install defra-air-quality-js --save


## Usage

See the `./examples` directory for various use cases.

#### `.list()` - List all stations

```js
defraAirQuality
  .list()
  .then(stations => {
    // stations - Array of stations
  });
```

#### `.findByName()` - Find a specific station by name

```js
defraAirQuality
  .findByName('Auchencorth Moss')
  .then(station => {
    // station - The requested station
  });
```

#### `.findByNearestLocation()` - List all stations

```js
defraAirQuality
  .findByNearestLocation(51.501476, -0.140634)
  .then(station => {
    // station - The nearest station to the supplied latitude and longitude
  });
```


## Source data

The data source for this library is Defra's UK Air quality https://uk-air.defra.gov.uk/assets/rss/current_site_levels.xml, which is updated hourly.


## Tests

This library has a full `mocha` test suite, which can be triggered by running:

    $ npm test