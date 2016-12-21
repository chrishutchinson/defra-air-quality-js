'use strict';

const fetch = require('node-fetch');
const parseString = require('xml2js').parseString;
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

const parseXML = (xml) => {
  return new Promise((fulfill, reject) => {
    parseString(xml, (err, result) => {
      if(err) {
        reject(err);
      } else {
        fulfill(result);
      }
    });
  })
}

const formatItem = (item) => {
  // Compute all the key parts
  const fullDescription = item.description[0];
  const parts = fullDescription.split('<br />');
  const description = parts[1].trim();
  const location = parts[0].replace(/Location :/g, '');
  const matches = description.match(/Current Pollution level is (.*) at index (.*)/);

  // Build the data object
  const data = { 
    title: item.title[0],
    link: item.link[0],
    location: entities.decode(location),
    description: description
  }

  // Add the level and index if we were able to parse them out of the description
  if (matches) {
    data.level = matches[1];
    data.index = matches[2];
  }

  // Return the new object
  return data;
}

module.exports = () => {
  return fetch('https://uk-air.defra.gov.uk/assets/rss/current_site_levels.xml')
    .then(data => data.text()) // Get the text
    .then(parseXML) // Parse the XML
    .then(object => object.rss.channel[0].item) // Return the items
    .then(items => items.map(formatItem)) // Map over each item and format
}