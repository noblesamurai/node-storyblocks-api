const camelCase = require('lodash.camelcase');
const mapKeys = require('lodash.mapkeys');
const snakeCase = require('lodash.snakecase');

/**
 * Convert object keys back to camel case again.
 *
 * @param {object} object
 * @return {object}
 */
function keysToCamelCase (object) {
  return mapKeys(object, (value, key) => {
    // Storyblocks returns resolutions prefixed with _'s. We want to remove
    // the _ and make sure the p remains lowercase.
    // (ie. '_1080p' => '1080p', not '_1080P' or even '1080P').
    if (/^_\d+p$/.test(key)) return key.slice(1);
    return camelCase(key);
  });
}

/**
 * Storyblocks APIs use snake case keys. So that we can use camel case keys
 * in JS we need to convert them back to snake case before making our
 * requests.
 *
 * @param {object} object
 * @return {object}
 */
function keysToSnakeCase (object) {
  return mapKeys(object, (value, key) => snakeCase(key));
}

module.exports = {
  keysToCamelCase,
  keysToSnakeCase
};
