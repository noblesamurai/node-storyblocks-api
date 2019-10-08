const crypto = require('crypto');
const mapKeys = require('lodash.mapkeys');
const snakeCase = require('lodash.snakecase');
const request = require('request-promise-native');

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
  constructor (base, credentials) {
    this[BASE] = base;
    this[CREDENTIALS] = credentials;
  }

  /**
   * Construct the require authentication query string parameters.
   *
   * @param {string} endpoint
   * @return {object}
   */
  auth (endpoint) {
    const { privateKey, publicKey } = this[CREDENTIALS];
    const expires = Math.floor(Date.now() / 1000);
    const hmac = crypto.createHmac('sha256', privateKey + expires);
    hmac.update(endpoint);
    return { EXPIRES: expires, HMAC: hmac.digest('hex'), APIKEY: publicKey };
  }

  /**
   * Given an endpoint, construct the full URI including the API base.
   *
   * @param {string} endpoint
   * @return {string}
   */
  uri (endpoint) {
    const base = this[BASE];
    return base + endpoint;
  }

  /**
   * Storyblocks APIs use snake case keys. So that we can use camel case keys
   * in JS we need to convert them back to snake case before making our
   * requests.
   *
   * @param {object} params
   * @return {object}
   */
  qs (params) {
    return mapKeys(params, (value, key) => snakeCase(key));
  }

  /**
   * Make a request.
   *
   * @param {string} endpoint
   * @param {string} method
   * @param {object} params
   * @return {object}
   */
  async request (endpoint, method, params) {
    const uri = this.uri(endpoint);
    const qs = { ...this.qs(params), ...this.auth(endpoint) };
    return request({ method, uri, qs, json: true });
  }
}

module.exports = StoryblocksApi;
