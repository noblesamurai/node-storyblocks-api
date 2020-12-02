const { expect } = require('chai');
const { getCredentials, nockBack } = require('./util');
const credentials = getCredentials();
const { audioblocks } = require('..')(credentials);

describe('service: audioblocks', function () {
  this.timeout(5000);

  it('should return a list of audio tracks', async () => {
    const fixture = 'audioblocks-search.json';
    const { nockDone, context } = await nockBack(fixture);
    const search = await audioblocks.search({
      resultsPerPage: 5,
      projectId: 'test',
      userId: 'test'
    });
    expect(search).to.be.an('object');
    expect(search.totalResults).to.be.a('number');
    expect(search.results).to.be.an('array').with.lengthOf(5);
    search.results.forEach(result => {
      expect(result).to.be.an('object')
        .that.includes.keys('id', 'title', 'thumbnailUrl', 'previewUrl', 'duration', 'bpm');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return content scores with a list of audio tracks', async () => {
    const fixture = 'audioblocks-search-with-content-scores.json';
    const { nockDone, context } = await nockBack(fixture);
    const search = await audioblocks.search({
      resultsPerPage: 5,
      projectId: 'test',
      userId: 'test',
      contentScores: true
    });
    expect(search).to.be.an('object');
    expect(search.totalResults).to.be.a('number');
    expect(search.results).to.be.an('array').with.lengthOf(5);
    search.results.forEach(result => {
      expect(result).to.be.an('object')
        .that.includes.keys('id', 'title', 'thumbnailUrl', 'previewUrl', 'duration', 'bpm');
    });

    expect(search.keywordScore).to.be.an('object');
    expect(search.keywordScore.score).to.be.a('number').that.is.within(0, 1);
    context.assertScopesFinished();
    nockDone();
  });

  it('should return audio track details', async () => {
    const fixture = 'audioblocks-audio.json';
    const { nockDone, context } = await nockBack(fixture);
    const track = await audioblocks.audio({
      stockItemId: 148396
    });
    expect(track).to.be.an('object')
      .that.includes.keys('id', 'title', 'thumbnailUrl', 'previewUrl', 'duration', 'bpm', 'categories', 'keywords');
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of download urls', async () => {
    const fixture = 'audioblocks-download.json';
    const { nockDone, context } = await nockBack(fixture);
    const download = await audioblocks.download({
      stockItemId: 148396,
      projectId: 'test',
      userId: 'test'
    });
    expect(download).to.be.an('object')
      .that.includes.keys('mp3', 'wav');
    Object.values(download).forEach(url => {
      expect(url).to.be.a('string')
        .that.startsWith('https://');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of similar audio tracks', async () => {
    const fixture = 'audioblocks-similar.json';
    const { nockDone, context } = await nockBack(fixture);
    const similar = await audioblocks.similar({
      stockItemId: 148396
    });
    expect(similar).to.be.an('array');
    similar.forEach(video => {
      expect(video).to.be.an('object')
        .that.includes.keys('id', 'title', 'thumbnailUrl', 'previewUrl', 'duration', 'bpm');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of categories', async () => {
    const fixture = 'audioblocks-categories.json';
    const { nockDone, context } = await nockBack(fixture);
    const categories = await audioblocks.categories();
    expect(categories).to.be.an('array');
    categories.forEach(category => {
      expect(category).to.be.an('object')
        .that.includes.keys('id', 'name', 'contentType');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of collections', async () => {
    const fixture = 'audioblocks-collections.json';
    const { nockDone, context } = await nockBack(fixture);
    const collections = await audioblocks.collections();
    expect(collections).to.be.an('array');
    collections.forEach(collection => {
      expect(collection).to.be.an('object')
        .that.includes.keys('id', 'name', 'description', 'numItems');
    });
    context.assertScopesFinished();
    nockDone();
  });

  it('should return a list of videos in a collection', async () => {
    const fixture = 'audioblocks-collection.json';
    const { nockDone, context } = await nockBack(fixture);
    const collection = await audioblocks.collection({
      collectionId: 250
    });
    expect(collection).to.be.an('array');
    collection.forEach(video => {
      expect(video).to.be.an('object')
        .that.includes.keys('id', 'title', 'thumbnailUrl', 'previewUrl', 'duration', 'bpm');
    });
    context.assertScopesFinished();
    nockDone();
  });
});
