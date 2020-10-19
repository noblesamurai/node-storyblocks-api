const StoryblocksApi = require('./storyblocks');
const e = require('./endpoint-template');

const APIS = [
  {
    service: 'audioblocks',
    type: 'audio',
    baseUrl: 'https://api.audioblocks.com/'
  },
  {
    service: 'videoblocks',
    type: 'video',
    baseUrl: 'https://api.videoblocks.com/'
  }
];

const services = credentials =>
  APIS.reduce(
    (acc, { service, type, baseUrl }) => ({
      ...acc,
      [service]: new StoryblocksApi(baseUrl, credentials, [
        ...(type === 'audio'
          ? [
            { name: 'search', endpoint: e`/api/v2/audio/search` },
            // audio is the only endpoint with subcategories...
            {
              name: 'subcategories',
              endpoint: e`/api/v2/stock-item/categories/${'category'}/subcategories`
            },
            { name: 'audio', endpoint: e`/api/v2/audio/stock-item/details/${'stock_item_id'}` },
            {
              name: 'download',
              endpoint: e`/api/v2/audio/stock-item/download/${'stock_item_id'}`
            },
            { name: 'categories', endpoint: e`/api/v2/audio/stock-item/categories` },
            { name: 'collections', endpoint: e`/api/v2/audio/stock-item/collections` },
          ]
          : [
            { name: 'search', endpoint: e`/api/v2/videos/search` },
            { name: 'video', endpoint: e`/api/v2/videos/stock-item/details/${'stock_item_id'}` },
            {
              name: 'download',
              endpoint: e`/api/v2/videos/stock-item/download/${'stock_item_id'}`
            },
            { name: 'categories', endpoint: e`/api/v2/videos/stock-item/categories` },
            { name: 'collections', endpoint: e`/api/v2/videos/stock-item/collections` },
          ]),
        {
          name: 'similar',
          endpoint: e`/api/v2/stock-items/similar/${'stock_item_id'}`
        },
        {
          name: 'collection',
          endpoint: e`/api/v2/collections/${'collection_id'}`
        }
      ])
    }),
    {}
  );

module.exports = services;
