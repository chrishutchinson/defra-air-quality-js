const fetch = require('node-fetch');

const parseXml = require('./parse-xml');
const formatItem = require('./format-item');

module.exports = () => {
  return fetch('https://uk-air.defra.gov.uk/assets/rss/current_site_levels.xml')
    .then(data => data.text()) // Get the text
    .then(parseXml) // Parse the XML
    .then(object => object.rss.channel[0].item) // Return the items
    .then(items => items.map(formatItem)); // Map over each item and format
};
