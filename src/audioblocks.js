const StoryblocksApi = require('./storyblocks');
const e = require('./endpoint-template');

const AUTIOBLOCKS_BASE = 'https://api.audioblocks.com/';

/**
 * Implements the Audioblocks API.
 * @see https://developer.storyblocks.com/docs/v1/index.html#/?id=audio
 */
function audioblocks (credentials) {
  return new StoryblocksApi(AUTIOBLOCKS_BASE, credentials, [
    { name: 'search', endpoint: e`/api/v1/stock-items/search` },
    { name: 'categories', endpoint: e`/api/v1/stock-items/categories` },
    { name: 'subcategories', endpoint: e`/api/v1/stock-items/categories/${'category'}/subcategories` },
    { name: 'image', endpoint: e`/api/v1/stock-items/${'stock_item_id'}` },
    { name: 'similar', endpoint: e`/api/v1/stock-items/similar/${'stock_item_id'}` },
    { name: 'download', endpoint: e`/api/v1/stock-items/download/${'stock_item_id'}/${'downloader_id'}` },
    { name: 'collections', endpoint: e`/api/v1/collections` },
    { name: 'collection', endpoint: e`/api/v1/collections/${'collection_id'}` }
  ]);
}

module.exports = audioblocks;
