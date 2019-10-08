const expect = require('chai').expect;
const sinon = require('sinon');

describe('example tests', function () {
  it('should work', function () {
    expect(true).to.be.true();
  });

  it('should resolve', async function () {
    const stub = sinon.stub().resolves(42);
    const result = await stub();
    expect(result).to.equal(42);
  });

  it('should reject', async function () {
    const stub = sinon.stub().rejects();
    const promise = stub();
    await expect(promise).to.eventually.be.rejected();
  });

  xit('should be a placeholder test');

  it('should fail', function () {
    throw new Error('unimplemented');
  });
});
