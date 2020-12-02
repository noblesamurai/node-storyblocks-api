const _createError = require('http-errors');
const crypto = require('crypto');
const got = require('got');
const isPlainObject = require('lodash.isplainobject');
const { keysToCamelCase, keysToSnakeCase } = require('./convert');

const AUTH_EXPIRY_SECONDS = 12 * 60 * 60; // 12 hours

function createError (code, errorOrErrors) {
  if (typeof errorOrErrors === 'string') return _createError(code, errorOrErrors);
  const errors = keysToCamelCase(errorOrErrors);
  return _createError(code, 'request failed', { errors });
}

// Strip any \u0000 null characters from the response before it is json parsed.
const client = got.extend({
  hooks: {
    afterResponse: [
      response => {
        return {
          ...response,
          body: response.body.replace('\\u0000', '')
        };
      }
    ]
  }
});

const PREFIX = Symbol('prefix');
const CREDENTIALS = Symbol('credentials');

class StoryblocksApi {
  /**
   * Constructor
   *
   * @param {string} prefix the api url prefix
   * @param {string} credentials.privateKey
   * @param {string} credentials.publicKey
   */
  constructor (prefix, credentials, endpoints = []) {
    this[PREFIX] = prefix;
    this[CREDENTIALS] = credentials;
    endpoints.forEach(addEndpoint.bind(this));
    // Don't allow any more modifications to this object after the constructor
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
    const { pathname } = new URL(`${this[PREFIX]}/${endpoint}`);
    hmac.update(pathname);
    return { EXPIRES: expires, HMAC: hmac.digest('hex'), APIKEY: publicKey };
  }

  /**
   * Make a request.
   *
   * @param {function} endpointFn
   * @param {string} method
   * @param {object} params
   * @return {object}
   */
  async request (endpointFn, method, parameters) {
    const { endpoint, query } = endpointFn(keysToSnakeCase(parameters));
    const options = {
      prefixUrl: this[PREFIX],
      method,
      searchParams: { ...query, ...this.auth(endpoint) },
      throwHttpErrors: false
    };
    const response = await client(endpoint, options);
    const results = JSON.parse(response.body, (key, value) => {
      return isPlainObject(value) ? keysToCamelCase(value) : value;
    });
    if (results.errors) throw createError(response.statusCode || 500, results.errors);
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
