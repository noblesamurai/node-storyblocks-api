const StoryblocksApi = require('./storyblocks');

const AUTIOBLOCKS_BASE = 'https://api.audioblocks.com/';

class AudioblocksApi extends StoryblocksApi {
  /**
   * Search for audio tracks.
   * @see https://developer.storyblocks.com/docs/v1/index.html#/?id=search-audio
   *
   * @param {object} params keys can be as in the API docs or camel case
   *   equivalents. eg.. { contentType: 'music', numResults: 5 }
   */
  async search (params) {
    const endpoint = '/api/v1/stock-items/search';
    return this.request(endpoint, 'GET', params);
  }
}

function audioblocks (credentials) {
  return new AudioblocksApi(AUTIOBLOCKS_BASE, credentials);
}

module.exports = audioblocks;
