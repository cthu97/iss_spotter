const request = require('request');

const fetchMyIP = (callback) => {
  request('https://api.ipify.org?format=json', (error, response, body) => {
    if (error) {
      return callback(error, null);
    }
    if (response.statusCode !== 200) {
      callback(Error(`Status code ${response.statusCode} when fetching IP :${body}`), null);
      return;
    }
    const { ip } = JSON.parse(body);
    callback(null, ip);
  });
};


module.exports = { fetchMyIP };
