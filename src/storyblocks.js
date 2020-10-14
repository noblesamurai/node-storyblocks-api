const createError = require('http-errors');
const crypto = require('crypto');
const got = require('got');
const mapKeys = require('lodash.mapkeys');
const snakeCase = require('lodash.snakecase');

const AUTH_EXPIRY_SECONDS = 12 * 60 * 60; // 12 hours

// strip any \u0000 null characters from the response before it is json parsed.
const client = got.extend({
  hooks: {
    afterResponse: response => ({
      ...response,
      body: response.body.replace('\\u0000', '')
    })
  }
});

const BASE = Symbol('base');
const CREDENTIALS = Symbol('credentials');

class StoryblocksApi {
  /**
   * Constructor
   *
   * @param {string} base the api base domain url
   * @param {string} credentials.privateKey
   * @param {string} credentials.publicKey
   */
  constructor (base, credentials, endpoints = []) {
    this[BASE] = base;
    this[CREDENTIALS] = credentials;
    endpoints.forEach(addEndpoint.bind(this));
    // don't allow any more modifications to this object after the constructor
    // has finished.
    Object.freeze(this);
  }

  /**
   * Construct the required authentication query string parameters.
   *
   * @param {string} endpoint
   * @return {object}
   */
  auth (endpoint) {
    const { privateKey, publicKey } = this[CREDENTIALS];
    const expires = Math.floor(Date.now() / 1000) + AUTH_EXPIRY_SECONDS;
    const hmac = crypto.createHmac('sha256', privateKey + expires);
    hmac.update(endpoint);
    return { EXPIRES: expires, HMAC: hmac.digest('hex'), APIKEY: publicKey };
  }

  /**
   * Storyblocks APIs use snake case keys. So that we can use camel case keys
   * in JS we need to convert them back to snake case before making our
   * requests.
   *
   * @param {object} params
   * @return {object}
   */
  query (params) {
    return mapKeys(params, (value, key) => snakeCase(key));
  }

  /**
   * Make a request.
   *
   * @param {function} endpointFn
   * @param {string} method
   * @param {object} params
   * @return {object}
   */
  async request (endpointFn, method, params) {
    const { endpoint, query } = endpointFn(this.query(params));
    const opts = {
      baseUrl: this[BASE],
      json: true,
      method,
      query: { ...query, ...this.auth(endpoint) },
      throwHttpErrors: false
    };
    const response = await client(endpoint, opts);
    const {
      body: { errors: message = 'request failed', ...results } = {},
      statusCode = 500
    } = response;
    if (statusCode >= 300) throw createError(statusCode, message, results);
    return results;
  }
}

/**
 * Add an endpoint to this API. Note that `this` is bound to the api when it
 * is called. This function has been defined outside of the class so that it
 * is only available in the constructor as it creates the API in the first
 * place.
 *
 * @param {string} config.name
 * @param {string} config.endpoint
 * @param {string} config.method
 */
function addEndpoint (config) {
  const { name, endpoint, method = 'GET' } = config;
  this[name] = this[name] || this.request.bind(this, endpoint, method);
}

module.exports = StoryblocksApi;
