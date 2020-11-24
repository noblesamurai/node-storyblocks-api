// Load local .env file config if it exists
require('dotenv').config();
const env = require('env-var');
const _nockBack = require('nock').back;
const { headersArrayToObject, headersInputToRawArray } = require('nock/lib/common');
const path = require('path');
const zlib = require('zlib');

// Set fixtures path
_nockBack.fixtures = path.resolve(__dirname, 'fixtures');

/**
 * Return the nockBack function with auth fix hooks automatically applied.
 * @see https://github.com/nock/nock#nock-back
 *
 * We also make sure we reset the nock recorder back to "wild" mode once we are done so that
 * normal nocks still work.
 *
 * @param {string} fixture
 * @return {object} { nockDone, context }
 */
async function nockBack (fixture) {
  // Use recorded nocks or record if we don't have any
  const previousMode = _nockBack.currentMode;
  _nockBack.setMode('record');
  const { nockDone: _nockDone, context } = await _nockBack(fixture, { after: fixScope, afterRecord });
  function nockDone () {
    _nockDone();
    // Restore the previous mode once done so normal nocks will still work.
    _nockBack.setMode(previousMode);
  }

  return { nockDone, context };
}

/**
 * After recording (before we write the fixture to disk) we want to rewrite the request query
 * params to not include auth keys.
 *
 * @param {object[]} defs
 * @return {object[]}
 */
function afterRecord (defs) {
  return ungzipFixtureDefinitionResponse(defs)
    .map(({ path, ...rest }) => ({ path: normaliseAuthQueryString(path), ...rest }));
}

/**
 * When we setup the playback scope we also want to attach a transform function to normalise the
 * auth querystring keys so that they will match what we have recorded.
 *
 * @param {object}
 */
function fixScope (scope) {
  scope.transformPathFunction = normaliseAuthQueryString;
}

/**
 * Load credential info from environment variables.
 *
 * @return {object}
 */
function getCredentials () {
  const privateKey = env.get('STORYBLOCKS_PRIVATE_KEY').default('PRIVATE_KEY').asString();
  const publicKey = env.get('STORYBLOCKS_PUBLIC_KEY').default('PUBLIC_KEY').asString();
  return { privateKey, publicKey };
}

/**
 * Given a path and query string, replace the authentication info with dummy values.
 *
 * @param {string} path
 * @return {string}
 */
function normaliseAuthQueryString (path) {
  const url = new URL(path, 'https://dummy');
  url.searchParams.set('APIKEY', 'PUBLIC_KEY');
  url.searchParams.set('EXPIRES', '1234567890');
  url.searchParams.set('HMAC', '0000000000');
  return url.pathname + url.search;
}

/**
 * Ungzip response contents to make it easier to read/debug.
 *
 * @param {object[]} defs
 * @return {object[]}
 */
function ungzipFixtureDefinitionResponse (defs) {
  return defs.map(def => {
    const headers = headersArrayToObject(def.rawHeaders);
    if (headers['content-encoding'] !== 'gzip') return def;

    const rawHeaders = headersInputToRawArray({ ...headers, 'content-encoding': '' });
    const data = def.response.join ? def.response.join('') : def.response;
    const binary = Buffer.from(data, 'hex');
    const buffer = zlib.gunzipSync(binary);
    const response = headers['content-type'] === 'application/json'
      ? JSON.parse(buffer)
      : buffer.toString();
    return { ...def, response, rawHeaders };
  });
}

module.exports = {
  getCredentials,
  nockBack
};
