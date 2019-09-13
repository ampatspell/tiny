const setup = require('../helpers/setup');
const assert = require('assert');

describe('actions / version', () => {
  setup(this);

  beforeEach(() => {
    this.handler = this.test.wrap(this.index.version);
  });

  it('returns version', async () => {
    let response = await this.handler({ }, { auth: {} });

    assert.deepEqual(response, {
      name: 'tiny-functions',
      version: require('../../package.json').version
    });
  });

});
