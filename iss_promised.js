const request = require('request-promise-native');

const fetchMyIp = () => {
  return request('https://api.ipify.org?format=json')
}

const fetchCoordsByIP = (input) => {
  const ip = JSON.parse(input).ip
  return request(`https://freegeoip.app/json/${ip}`)
}

const fetchISSFlyOverTimes = (input) => {
  const coords = {
    latitude: JSON.parse(input).latitude,
    longitude: JSON.parse(input).longitude
  }

  return request(`http://api.open-notify.org/iss/v1/?lat=${coords.latitude}&lon=${coords.longitude}`);

}

const nextISSTimesForMyLocation = () => {
  return fetchMyIp()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };
