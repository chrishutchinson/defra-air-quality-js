const parseString = require('xml2js').parseString;

module.exports = xml =>
  new Promise((fulfill, reject) => {
    parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        fulfill(result);
      }
    });
  });
