const audioblocks = require('./audioblocks');
const graphicstock = require('./graphicstock');
const videoblocks = require('./videoblocks');

const services = credentials => ({
  audioblocks: audioblocks(credentials),
  graphicstock: graphicstock(credentials),
  videoblocks: videoblocks(credentials)
});

module.exports = services;
