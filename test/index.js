const credentials = { privateKey: 'PRIVATE_KEY', publicKey: 'PUBLIC_KEY' };
const expect = require('chai').expect;
const nock = require('nock');
const createError = require('http-errors');
const BadRequestError = createError(400).constructor;
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
  /*
  {
    service: 'audioblocks',
    type: 'audio',
    baseUrl: 'https://api.audioblocks.com/api/v2/audio/'
  },
  */
  {
    service: 'videoblocks',
    type: 'video',
    baseUrl: 'https://api.videoblocks.com/api/v2/videos/'
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
        .get('/search')
        .query(q => (query = q) || true) // export query for checking later
        .reply(200, { total_results: 1, results: ['ITEM'] });

      const response = await service.search({ keyword: 'fish', resultsPerPage: 5, projectId: 'test', userId: 'test' });
      expect(response).to.deep.equal({ total_results: 1, results: ['ITEM'] });
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

    it('should get rid of \u0000', async function () {
      nock(baseUrl)
        .get('/search')
        .query(true)
        .reply(200, {
          total_results: 1,
          results: { blerg: 'things\u0000' }
        });

      const response = await service.search({ keyword: 'fish', numResults: 5, projectId: 'test', userId: 'test' });
      expect(response.results.blerg).to.equal('things');
    });

    it('should handle an error string response', async function () {
      nock(baseUrl)
        .get('/search')
        .query(true)
        .reply(400, { errors: 'HMAC header is invalid' });
      const search = service.search();
      await expect(search).to.be.rejectedWith(
        BadRequestError,
        'HMAC header is invalid'
      );
    });

    it('should handle an error object response', async function () {
      nock(baseUrl)
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
