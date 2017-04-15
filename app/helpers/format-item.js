const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();

const calculateDd = (degrees, minutes, seconds, direction) => {
  const secondsAsFraction = seconds / 60;
  const withMinutes = minutes + secondsAsFraction;
  const minutesAsDegrees = withMinutes / 60;
  const withDegrees = degrees + minutesAsDegrees;
  const multiplier = direction === 'S' || direction === 'W' ? -1 : 1;
  const dd = withDegrees * multiplier;

  return dd;
};

const processLocation = location => {
  const p = entities
    .decode(location)
    .replace(/Location: /g, '')
    .replace(/    /g, ' ')
    .trim()
    .match(
      /(\d{1,2})°(\d{1,2})´(\d{1,2}\.\d{1,2})"(\w{1}) (\d{1,2})°(\d{1,2})´(\d{1,2}\.\d{1,2})"(\w{1})/
    );

  const ddLat = calculateDd(Number(p[1]), Number(p[2]), Number(p[3]), p[4]);
  const ddLong = calculateDd(Number(p[5]), Number(p[6]), Number(p[7]), p[8]);

  return {
    dms: `${p[1]}°${p[2]}´${p[3]}"${p[4]} ${p[5]}°${p[6]}´${p[7]}"${p[8]}`,
    latitude: Number(ddLat.toFixed(6)),
    longitude: Number(ddLong.toFixed(6)),
  };
};

module.exports = item => {
  // Compute all the key parts
  const fullDescription = item.description[0];
  const parts = fullDescription.split('<br />');
  const description = parts[1].trim();
  const location = processLocation(parts[0]);
  const matches = description.match(
    /Current Pollution level is (.*) at index (.*)/
  );

  // Build the data object
  const data = {
    title: item.title[0],
    link: item.link[0],
    location: location,
    description: description,
  };

  // Add the level and index if we were able to parse them out of the description
  if (matches) {
    data.level = matches[1];
    data.index = matches[2];
  }

  // Return the new object
  return data;
};
