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

const fetchCoordsByIP = (ip, callback) => {
  request(`https://freegeoip.app/json/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching Coordinates for IP: ${body}`), null);
      return;
    }

    const coords = {
      latitude: JSON.parse(body).latitude,
      longitude: JSON.parse(body).longitude,
    };

    callback(null, coords);
  });
};

const fetchISSFlyOverTimes = (coords, callback) => {
  const url = `http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(url, (error, response, body) => {
    if (error) {
      return callback(error, null);
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passes = JSON.parse(body).response;
    callback(null, passes);
  });
};

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, coords) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(coords, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };
