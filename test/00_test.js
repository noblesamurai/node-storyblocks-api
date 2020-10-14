const chai = require('chai');
const nock = require('nock');
chai.use(require('chai-as-promised'));
chai.use(require('dirty-chai'));

afterEach(() => {
  nock.cleanAll();
});
