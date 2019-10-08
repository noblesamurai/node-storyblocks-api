// list of formatters
const formatters = { date: _date, enum: _enum };

/**
 * Formats a date value.
 *
 * @param {date} value
 * @return {string}
 */
function _date (value) {
  return value.toISOString().substr(0, 10);
}

/**
 * Format an emun value.
 *
 * @param {array|string} value
 * @return {string}
 */
function _enum (value) {
  return Array.isArray(value) ? value.join(',') : value;
}

/**
 * No formatting required, just return as is.
 *
 * @param {*} value
 * @return {*}
 */
function _noop (value) {
  return value;
}

/**
 * Return a format function based on the config passed in.
 *
 * @param {object} config
 * @return function
 */
function format (config) {
  const { type } = config;
  const { [type]: formatter = _noop } = formatters;
  return formatter;
}

module.exports = format;
