const audioblocks = require('./audioblocks');

const services = credentials => ({
  audioblocks: audioblocks(credentials)
});

module.exports = services;
