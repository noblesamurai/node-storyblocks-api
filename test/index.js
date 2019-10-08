const credentials = { privateKey: 'PRIVATE_KEY', publicKey: 'PUBLIC_KEY' };
const storyblocks = require('..')(credentials);
const expect = require('chai').expect;

describe('index', function () {
  it('should contain services', function () {
    expect(storyblocks).to.have.property('audioblocks');
    const { audioblocks } = storyblocks;
    expect(audioblocks).to.be.instanceOf(require('../src/storyblocks'));
  });
});
