/**
 * Create an endpoint creation function so that we can inject query values
 * into the actual URL (removing them from the query object in the process).
 *
 * @param {array} strings
 * @param {array<string>} ...keys
 * @return {function}
 */
function endpointTemplate (strings, ...keys) {
  /**
   * Inject query params into the URL and remove them from the query object.
   *
   * @param {object} query
   * @return {string}
   */
  return function endpoint (query) {
    let endpoint = '';
    for (const [i, key] of keys.entries()) {
      const { [key]: value, ...rest } = query;
      endpoint += strings[i] + value;
      query = rest;
    }
    endpoint += strings[strings.length - 1];
    return { endpoint, query };
  };
}

module.exports = endpointTemplate;
