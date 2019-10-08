const credentials = { privateKey: 'PRIVATE_KEY', publicKey: 'PUBLIC_KEY' };
const audioblocks = require('../src/audioblocks')(credentials);
const expect = require('chai').expect;
const nock = require('nock');
const createError = require('http-errors');
const UnauthorizedError = createError(401).constructor;

describe('audioblocks', function () {
  it('should return an audioblocks api service', function () {
    expect(audioblocks).to.be.an.instanceOf(require('../src/storyblocks'));
    expect(audioblocks).to.respondTo('search');
    expect(audioblocks).to.respondTo('categories');
    expect(audioblocks).to.respondTo('subcategories');
    expect(audioblocks).to.respondTo('image');
    expect(audioblocks).to.respondTo('similar');
    expect(audioblocks).to.respondTo('download');
    expect(audioblocks).to.respondTo('collections');
    expect(audioblocks).to.respondTo('collection');
  });

  it('should search for audio', async function () {
    let query;
    nock('https://api.audioblocks.com')
      .get('/api/v1/stock-items/search')
      .query(q => (query = q) || true) // export query for checking later
      .reply(200, { success: true, items: ['ITEM'] });

    const results = await audioblocks.search({ keyword: 'fish', numResults: 5 });
    expect(results).to.deep.equal({ items: ['ITEM'] });
    expect(query).to.have.keys('keyword', 'num_results', 'EXPIRES', 'HMAC', 'APIKEY');
    expect(query).to.include({ keyword: 'fish', num_results: '5' });
  });

  it('should throw an error', async function () {
    nock('https://api.audioblocks.com')
      .get('/api/v1/stock-items/search')
      .query(true)
      .reply(401, { success: false, code: 1001, message: 'API request is invalid.' });

    const search = audioblocks.search();
    await expect(search).to.eventually.be.rejectedWith(UnauthorizedError, 'API request is invalid.');
  });
});
