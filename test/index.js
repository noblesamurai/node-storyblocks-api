const credentials = { privateKey: 'PRIVATE_KEY', publicKey: 'PUBLIC_KEY' };
const expect = require('chai').expect;
const nock = require('nock');
const createError = require('http-errors');
const UnauthorizedError = createError(401).constructor;
const storyblocks = require('..')(credentials);

describe('index', function () {
  it('should contain services', function () {
    expect(storyblocks).to.have.property('audioblocks');
    const { audioblocks, videoblocks } = storyblocks;
    expect(audioblocks).to.be.instanceOf(require('../src/storyblocks'));
    expect(videoblocks).to.be.instanceOf(require('../src/storyblocks'));
  });
});

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
APIS.forEach(({ service: name, type, baseUrl }) => {
  describe(`index: ${name}`, function () {
    const { [name]: service } = storyblocks;

    it(`should return an ${name} api service`, function () {
      expect(service).to.be.an.instanceOf(require('../src/storyblocks'));
      expect(service).to.respondTo('search');
      expect(service).to.respondTo('categories');
      if (name === 'audio') expect(service).to.respondTo('subcategories');
      expect(service).to.respondTo(type);
      expect(service).to.respondTo('similar');
      expect(service).to.respondTo('download');
      expect(service).to.respondTo('collections');
      expect(service).to.respondTo('collection');
    });

    it(`should search for ${type}`, async function () {
      let query;
      nock(baseUrl)
        .get(`/api/v2/${type === 'audio' ? 'audio' : 'videos'}/search`)
        .query(q => (query = q) || true) // export query for checking later
        .reply(200, { total_results: 1, results: ['ITEM'] });

      const results = await service.search({ projectId: 'blerg', userId: 'merg', keyword: 'fish' });
      expect(results).to.deep.equal({ total_results: 1, results: ['ITEM'] });
      expect(query).to.have.keys(
        'APIKEY',
        'EXPIRES',
        'HMAC',
        'keyword',
        'project_id',
        'user_id'
      );
      expect(query).to.include({ keyword: 'fish', project_id: 'blerg', user_id: 'merg' });
    });

    it('should get rid of \u0000', async function () {
      nock(baseUrl)
        .get(`/api/v2/${type === 'audio' ? 'audio' : 'videos'}/search`)
        .query(true)
        .reply(200, {
          results: ['things\u0000']
        });

      const results = await service.search({ projectId: 'blerg', userId: 'merg', keyword: 'fish' });
      expect(results.results[0]).to.equal('things');
    });

    it('should throw an error', async function () {
      nock(baseUrl)
        .get(`/api/v2/${type === 'audio' ? 'audio' : 'videos'}/search`)
        .query(true)
        .reply(401, {
          success: false,
          code: 1001,
          message: 'API request is invalid.'
        });

      const search = service.search();
      await expect(search).to.be.rejectedWith(
        UnauthorizedError,
        'API request is invalid.'
      );
    });
  });
});
