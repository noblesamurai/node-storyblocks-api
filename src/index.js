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
        { name: 'categories', endpoint: e`/api/v2/stock-items/categories` },
        ...(type === 'audio'
          ? [
            { name: 'search', endpoint: e`/api/v2/audio/search` },
            // audio is the only endpoint with subcategories...
            {
              name: 'subcategories',
              endpoint: e`/api/v2/stock-items/categories/${'category'}/subcategories`
            }
          ]
          : [
            { name: 'search', endpoint: e`/api/v2/videos/search` }
          ]),
        { name: type, endpoint: e`/api/v2/stock-items/${'stock_item_id'}` },
        {
          name: 'similar',
          endpoint: e`/api/v2/stock-items/similar/${'stock_item_id'}`
        },
        {
          name: 'download',
          endpoint: e`/api/v2/stock-items/download/${'stock_item_id'}/${'downloader_id'}`
        },
        { name: 'collections', endpoint: e`/api/v2/collections` },
        {
          name: 'collection',
          endpoint: e`/api/v2/collections/${'collection_id'}`
        }
      ])
    }),
    {}
  );

module.exports = services;
