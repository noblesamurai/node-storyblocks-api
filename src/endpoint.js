const camelCase = require('lodash.camelcase');
const crypto = require('crypto');
const errCode = require('err-code');
const format = require('./format');
const mapValues = require('lodash.mapvalues');
const ow = require('ow');
const pick = require('lodash.pick');
const request = require('request-promise-native');
const transform = require('lodash.transform');
const { URL } = require('url');
const validate = require('./validate');

const ORIGINAL_KEY = Symbol('original key');

/**
 * Create the main service (audioblocks, videoblocks etc...)
 *
 * @throws
 * @param {object} config
 * @return {object}
 */
function endpoint (config, credentials) {
  config = patchConfig(config);
  const { method } = config;
  const validate = createOptionsValidationFunction(config);
  const createQuery = createQueryParamsFunction(config);
  const createUri = createUriFunction(config);
  const responseHandler = createResponseHandler(config);

  return async function makeRequest (options = {}) {
    validate(options);
    const uri = createUri(options);
    const qs = { ...createQuery(options), ...createAuthQueryParams(uri, credentials) };
    try {
      const response = await request({ method, uri, qs, json: true });
      return responseHandler(response);
    } catch (err) {
      if (err.response && err.response.body) return responseHandler(err.response.body);
      console.error('request failed', err);
      throw new Error('request failed');
    }
  };
}

/**
 * Handle response from storyblocks
 *
 * @throws
 * @param {object} config
 * @return {object}
 */
function createResponseHandler (config) {
  const responseFields = Object.keys(config.response);
  return function responseHandler (response) {
    const { success, message } = response;
    if (!success) throw errCode(new Error(message), response);
    return pick(response, responseFields);
  };
}

/**
 * Return a function to be used to validate our input options.
 *
 * @param {object} config
 * @return {function}
 */
function createOptionsValidationFunction (config) {
  const { params = {}, query = {} } = config;
  const shape = { ...mapValues(params, validate), ...mapValues(query, validate) };
  return ow.create('options', ow.object.exactShape(shape));
}

/**
 * Create query params required for authentication.
 *
 * @param {string} uri
 * @param {string} credentials.privateKey
 * @param {string} credentials.publicKey
 * @return {object}
 */
function createAuthQueryParams (uri, credentials = {}) {
  const { privateKey, publicKey } = credentials;
  ow(privateKey, ow.string);
  ow(publicKey, ow.string);

  const { pathname: endpoint } = new URL(uri);
  const expires = Math.floor(Date.now() / 1000);
  const hmac = crypto.createHmac('sha256', privateKey + expires);
  hmac.update(endpoint);
  return { EXPIRES: expires, HMAC: hmac.digest('hex'), APIKEY: publicKey };
}

/**
 * Return a function to be used to create the request URI.
 *
 * @param {object} config
 * @return {function}
 */
function createUriFunction (config) {
  const { uri, params = {} } = config;
  const replacers = Object.entries(params).map(([key, { [ORIGINAL_KEY]: originalKey }]) => {
    return (uri, { [key]: value }) => uri.replace(`{${originalKey}}`, value);
  });

  /**
   * Create endpoint URI based on input options.
   *
   * @param {object} options
   * @return {string}
   */
  return function createUri (options) {
    return replacers.reduce((acc, fn) => fn(acc, options), uri);
  };
}

/**
 * Return a function to be used to create our request query params.
 *
 * @param {object} config
 * @return {function}
 */
function createQueryParamsFunction (config) {
  const { query = {} } = config;
  const formatters = mapValues(query, format);

  /**
   * Create a query params object from options.
   *
   * @param {object} options
   * @return {object}
   */
  return function createQueryParams (options) {
    return transform(options, (result, value, key) => {
      const { [key]: { [ORIGINAL_KEY]: queryKey } = {} } = query;
      const { [key]: formatter } = formatters;
      if (!formatter || !queryKey) return;
      result[queryKey] = formatter(value);
    }, {});
  };
}

/**
 * Patch the config once to add all the info we need for making requests.
 * - Convert all keys to camel case (but keep the originals for the actual query request)
 * - Add a required flag to "params" and "response" values.
 *
 * @param {object} config
 * @return {object}
 */
function patchConfig (config) {
  const params = patchConfigObject(config.params, true);
  const query = patchConfigObject(config.query);
  const response = patchConfigObject(config.response, true);
  return { ...config, params, query, response };
}

/**
 * Patch an individual config object (params, query, response).
 *
 * @param {object} object
 * @param {boolean} required
 * @return {object}
 */
function patchConfigObject (object = {}, required = false) {
  return transform(object, (result, value, key) => {
    result[camelCase(key)] = { ...value, [ORIGINAL_KEY]: key, required };
  }, {});
}

module.exports = endpoint;
