const createError = require('http-errors');
const crypto = require('crypto');
const got = require('got');
const mapKeys = require('lodash.mapkeys');
const snakeCase = require('lodash.snakecase');

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
  query (params) {
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
    const baseUrl = this[BASE];
    const query = { ...this.query(params), ...this.auth(endpoint) };
    const opts = { baseUrl, json: true, method, query, throwHttpErrors: false };
    const response = await got(endpoint, opts);
    const {
      body: { success = false, message = 'request failed', ...results } = {},
      statusCode = 500
    } = response;
    if (!success) throw createError(statusCode, message, results);
    return results;
  }
}

module.exports = StoryblocksApi;
