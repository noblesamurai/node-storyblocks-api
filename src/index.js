const StoryblocksApi = require('./storyblocks');
const e = require('./endpoint-template');

const APIS = [
  {
    service: 'audioblocks',
    type: 'audio',
    prefixUrl: 'https://api.audioblocks.com/api/v2/audio'
  },
  {
    service: 'videoblocks',
    type: 'video',
    prefixUrl: 'https://api.videoblocks.com/api/v2/videos'
  },
  {
    service: 'graphicstock',
    type: 'image',
    prefixUrl: 'https://api.graphicstock.com/api/v2/images'
  }
];

function services (credentials) {
  const services = {};
  APIS.forEach(({ service, type, prefixUrl }) => {
    services[service] = new StoryblocksApi(prefixUrl, credentials, [
      { name: 'search', endpoint: e`search` },
      { name: 'categories', endpoint: e`stock-item/categories` },
      { name: type, endpoint: e`stock-item/details/${'stock_item_id'}` },
      { name: 'similar', endpoint: e`stock-item/similar/${'stock_item_id'}` },
      { name: 'download', endpoint: e`stock-item/download/${'stock_item_id'}` },
      { name: 'collections', endpoint: e`collections` },
      { name: 'collection', endpoint: e`collections/${'collection_id'}` }
    ]);
  });
  return services;
}

module.exports = services;
