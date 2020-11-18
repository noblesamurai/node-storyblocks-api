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

const services = credentials =>
  APIS.reduce(
    (acc, { service, type, prefixUrl }) => ({
      ...acc,
      [service]: new StoryblocksApi(prefixUrl, credentials, [
        { name: 'search', endpoint: e`search` },
        { name: 'categories', endpoint: e`stock-item/categories` },
        { name: type, endpoint: e`stock-item/details/${'stock_item_id'}` },
        { name: 'similar', endpoint: e`stock-item/similar/${'stock_item_id'}` },
        { name: 'download', endpoint: e`stock-item/download/${'stock_item_id'}` },
        { name: 'collections', endpoint: e`stock-item/collections` },
        { name: 'collection', endpoint: e`stock-item/collections/${'collection_id'}` }
      ])
    }),
    {}
  );

module.exports = services;
