/**
 * Create an endpoint creation function so that we can inject query values
 * into the actual URL (removing them from the query object in the process).
 *
 * Usage example:
 * ```
 * const endpointFn = endpointTemplate`/api/item/${'item'}`;
 * const { endpoint, query } = endpointFn({ item: 42, keyword: 'test' });
 * // endpoint = '/api/item/42';
 * // query = { keyword: 'test' };
 * ```
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
  return function (query) {
    let endpoint = '';
    // Construct the endpoint url using values from the input query object and
    // remove them from the final query string at the same time.
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
