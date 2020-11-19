const expect = require('chai').expect;
const { getCredentials, nockBack } = require('./util');
const credentials = getCredentials();
const { videoblocks } = require('..')(credentials);

describe('service: videoblocks', function () {
  this.timeout(5000);

  it('should return a list of videos', async function () {
    const fixture = 'videoblocks-search.json';
    const { nockDone, context } = await nockBack(fixture);
    const search = await videoblocks.search({
      keywords: 'fish',
      resultsPerPage: 5,
      projectId: 'test',
      userId: 'test'
    });
    expect(search).to.be.an('object');
    expect(search.total_results).to.be.a('number');
    expect(search.results).to.be.an('array').with.lengthOf(5);
    search.results.forEach(result => {
      expect(result).to.be.an('object')
        .that.includes.keys('id', 'title', 'thumbnail_url', 'preview_urls', 'duration');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return content scores with a list of videos', async function () {
    const fixture = 'videoblocks-search-with-content-scores.json';
    const { nockDone, context } = await nockBack(fixture);
    const search = await videoblocks.search({
      keywords: 'fish',
      resultsPerPage: 5,
      projectId: 'test',
      userId: 'test',
      contentScores: true
    });
    expect(search).to.be.an('object');
    expect(search.total_results).to.be.a('number');
    expect(search.results).to.be.an('array').with.lengthOf(5);
    search.results.forEach(result => {
      expect(result).to.be.an('object')
        .that.includes.keys('id', 'title', 'thumbnail_url', 'preview_urls', 'duration');
    });

    expect(search.keywordScore).to.be.an('object');
    expect(search.keywordScore.score).to.be.a('number').that.is.within(0, 1);
    context.assertScopesFinished();
    nockDone();
  });

  it('should return video details', async function () {
    const fixture = 'videoblocks-video.json';
    const { nockDone, context } = await nockBack(fixture);
    const video = await videoblocks.video({
      stockItemId: 8180348
    });
    expect(video).to.be.an('object')
      .that.includes.keys('id', 'title', 'thumbnail_url', 'preview_urls', 'duration', 'categories', 'keywords');
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of download urls', async function () {
    const fixture = 'videoblocks-download.json';
    const { nockDone, context } = await nockBack(fixture);
    const download = await videoblocks.download({
      stockItemId: 8180348,
      projectId: 'test',
      userId: 'test'
    });
    expect(download).to.be.an('object')
      .that.includes.keys('MP4');
    expect(download.MP4).to.be.an('object')
      .that.includes.keys('_720p', '_1080p');
    Object.values(download.MP4).forEach(url => {
      expect(url).to.be.a('string')
        .that.startsWith('https://');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of similar videos', async function () {
    const fixture = 'videoblocks-similar.json';
    const { nockDone, context } = await nockBack(fixture);
    const similar = await videoblocks.similar({
      stockItemId: 8180348
    });
    expect(similar).to.be.an('array');
    similar.forEach(video => {
      expect(video).to.be.an('object')
        .that.includes.keys('id', 'title', 'thumbnail_url', 'preview_urls', 'duration');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of categories', async function () {
    const fixture = 'videoblocks-categories.json';
    const { nockDone, context } = await nockBack(fixture);
    const categories = await videoblocks.categories();
    expect(categories).to.be.an('array');
    categories.forEach(category => {
      expect(category).to.be.an('object')
        .that.includes.keys('id', 'name', 'content_type');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of collections', async function () {
    const fixture = 'videoblocks-collections.json';
    const { nockDone, context } = await nockBack(fixture);
    const collections = await videoblocks.collections();
    expect(collections).to.be.an('array');
    collections.forEach(collection => {
      expect(collection).to.be.an('object')
        .that.includes.keys('id', 'name', 'description', 'num_items');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of videos in a collection', async function () {
    const fixture = 'videoblocks-collection.json';
    const { nockDone, context } = await nockBack(fixture);
    const collection = await videoblocks.collection({
      collectionId: 22679
    });
    expect(collection).to.be.an('array');
    collection.forEach(video => {
      expect(video).to.be.an('object')
        .that.includes.keys('id', 'title', 'thumbnail_url', 'preview_urls', 'duration');
    });
    context.assertScopesFinished();
    nockDone();
  });
});
