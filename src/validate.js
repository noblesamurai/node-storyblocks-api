const ow = require('ow');

// list of validators
const validators = {
  boolean: _boolean,
  color: _color,
  date: _date,
  enum: _enum,
  integer: _integer,
  string: _string
};

/**
 * Returns an "ow" predicate with the optional flag set.
 *
 * @param {boolean} config.required
 * @return {ow.predicate}
 */
function _required (config) {
  return config.required ? ow : ow.optional;
}

/**
 * Returns an "ow" predicate for validating a boolean.
 *
 * @param {object} config
 * @return {ow.predicate}
 */
function _boolean (config) {
  return _required(config).boolean;
}

/**
 * Returns an "ow" predicate for validating a color.
 *
 * @param {object} config
 * @return {ow.predicate}
 */
function _color (config) {
  return _required(config).string.matches(/^#?[\da-f]{6}$/i);
}

/**
 * Returns an "ow" predicate for validating a date.
 *
 * @param {object} config
 * @return {ow.predicate}
 */
function _date (config) {
  return _required(config).date;
}

/**
 * Returns an "ow" predicate for validating an enum.
 *
 * @param {object} config
 * @return {ow.predicate}
 */
function _enum (config) {
  const { values = [] } = config;
  const validOption = ow.string.oneOf(values);
  return _required(config).any(validOption, ow.array.ofType(validOption));
}

/**
 * Returns an "ow" predicate for validating an integer.
 *
 * @param {object} config
 * @return {ow.predicate}
 */
function _integer (config) {
  const { max = Infinity } = config;
  return _required(config).number.integer.lessThanOrEqual(max);
}

/**
 * Returns an "ow" predicate for validating a string.
 *
 * @param {object} config
 * @return {ow.predicate}
 */
function _string (config) {
  return _required(config).string;
}

/**
 * Will throw an error if the type is unknown.
 *
 * @param {object} config
 * @throws
 */
function _unknown (config) {
  const { type } = config;
  throw new Error(`unknown validation type: ${type}`);
}

/**
 * Return a "ow" predicate to validate what is defined by the passed in config.
 *
 * @param {object} config
 * @param {string} config.type
 * @return {ow.predicate}
 */
function validate (config) {
  const { [config.type]: validator = _unknown } = validators;
  return validator(config);
}

module.exports = validate;
