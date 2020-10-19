const { expect } = require('chai');

if (process.env.STORYBLOCKS_PRIVATE_KEY && process.env.STORYBLOCKS_PUBLIC_KEY) {
  const privateKey = process.env.STORYBLOCKS_PRIVATE_KEY;
  const publicKey = process.env.STORYBLOCKS_PUBLIC_KEY;
  const credentials = { privateKey, publicKey };
  const storyblocks = require('..')(credentials);

  describe('live tests', function () {
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
        it(`should search for ${type}`, async function () {
          const results = await service.search({ projectId: 'blerg', userId: 'test', keywords: 'fish' });
          expect(results).to.be.ok();
        });
        it(`works to get item info for ${type}`, async function () {
          let results;
          try {
            results = await service[type]({ projectId: 'blerg', userId: 'test', stockItemId: 123 });
          } catch (err) {
            if (err.message === 'Stock Item not found.') return true;
            throw err;
          }
          expect(results).to.be.ok();
        });
        it(`works to get download info for ${type}`, async function () {
          let results;
          try {
            results = await service.download({ projectId: 'blerg', userId: 'test', stockItemId: 123 });
          } catch (err) {
            if (err.message === 'The stock item is invalid.') return true;
            throw err;
          }
          expect(results).to.be.ok();
        });
        it(`gets categories/collections for ${type}`, async function () {
          const results = await service.categories();
          expect(results).to.be.ok();
          const results = await service.collections();
          expect(results).to.be.ok();
        });
      });
    });
  });
}
