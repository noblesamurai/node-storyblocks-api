const credentials = { privateKey: 'PRIVATE_KEY', publicKey: 'PUBLIC_KEY' };
const { expect } = require('chai');
const nock = require('nock');
const createError = require('http-errors');
const BadRequestError = createError(400).constructor;
const storyblocks = require('..')(credentials);

describe('index', () => {
  it('should contain services', () => {
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
    prefixUrl: 'https://api.audioblocks.com/api/v2/audio/'
  },
  {
    service: 'videoblocks',
    type: 'video',
    prefixUrl: 'https://api.videoblocks.com/api/v2/videos/'
  }
];
APIS.forEach(({ service: name, type, prefixUrl }) => {
  describe(`index: ${name}`, () => {
    const { [name]: service } = storyblocks;

    beforeEach(() => {
      nock.cleanAll();
      nock.disableNetConnect();
    });

    afterEach(() => {
      nock.cleanAll();
    });

    it(`should return an ${name} api service`, () => {
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

    it(`should search for ${type}`, async () => {
      let query;
      nock(prefixUrl)
        .get('/search')
        .query(q => (query = q) || true) // Export query for checking later
        .reply(200, { totalResults: 1, results: ['ITEM'] });

      const response = await service.search({ keyword: 'fish', resultsPerPage: 5, projectId: 'test', userId: 'test' });
      expect(response).to.deep.equal({ totalResults: 1, results: ['ITEM'] });
      expect(query).to.have.keys(
        'keyword',
        'results_per_page',
        'project_id',
        'user_id',
        'EXPIRES',
        'HMAC',
        'APIKEY'
      );
      expect(query).to.include({ keyword: 'fish', results_per_page: '5', project_id: 'test', user_id: 'test' });
    });

    it('should get rid of \u0000', async () => {
      nock(prefixUrl)
        .get('/search')
        .query(true)
        .reply(200, {
          totalResults: 1,
          results: { blerg: 'things\u0000' }
        });

      const response = await service.search({ keyword: 'fish', numResults: 5, projectId: 'test', userId: 'test' });
      expect(response.results.blerg).to.equal('things');
    });

    it('should handle an error string response', async () => {
      nock(prefixUrl)
        .get('/search')
        .query(true)
        .reply(400, { errors: 'HMAC header is invalid' });
      const search = service.search();
      await expect(search).to.be.rejectedWith(
        BadRequestError,
        'HMAC header is invalid'
      );
    });

    it('should handle an error object response', async () => {
      nock(prefixUrl)
        .get('/search')
        .query(true)
        .reply(400, {
          errors: {
            user_id: ['The user id must be included'],
            project_id: ['The project id must be included']
          }
        });

      const search = service.search();
      await expect(search).to.eventually.be.rejectedWith(BadRequestError)
        .and.have.property('errors')
        .that.is.an('object').that.deep.equals({
          userId: ['The user id must be included'],
          projectId: ['The project id must be included']
        });
    });
  });
});
