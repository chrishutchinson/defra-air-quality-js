'use strict';

const getUkData = require('./helpers/get-uk-data');

getUkData()
  .then(console.log)
  .catch(err => console.log('[ERR]', err))