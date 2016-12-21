# Defra UK Air Quality data formatter

> A Node.js library for scraping, formatting and returning Defra Air Quality data

## About

This library exposes a full, formatted list of air quality measurement stations around the UK.


## Installation

    $ npm install defra-air-quality-js


## Usage

    const airQuality = require('defra-air-quality-js');

    airQuality() // This returns a promise
      .then(console.log) // Do what you want here
      .catch(err => console.log(err)) // Handle any error here


## Source

The data source for this library is Defra's UK Air quality https://uk-air.defra.gov.uk/assets/rss/current_site_levels.xml, which is updated hourly.