const expect = require('chai').expect;
const e = require('../src/endpoint-template');

describe('endpoint templates', function () {
  it('should return an endpoint string and modified query params', function () {
    const template = e`/api/user/${'user_id'}/video/${'video_id'}`;
    const { endpoint, query } = template({ user_id: 42, video_id: 99, keyword: 'something' });
    expect(endpoint).to.equal('/api/user/42/video/99');
    expect(query).to.deep.equal({ keyword: 'something' });
  });
});
