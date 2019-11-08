const axios = require('axios');

// Axios object to control the connection with the API
const api = axios.create({
    baseURL: 'http://192.168.137.206'
});

module.exports = api;