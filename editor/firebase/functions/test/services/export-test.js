const setup = require('../helpers/setup');
const assert = require('assert');

describe('services / export', () => {
  setup(this);

  beforeEach(() => {
    this.export = this.app.services.export;
  });

  it('hello', async () => {
    console.log(this.export);
  });

});
