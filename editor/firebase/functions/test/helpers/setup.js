module.exports = function(sender) {

  const setup = require('./setup-all');

  beforeEach(() => {
    sender._destroy = setup(sender, 'test');
  });

  afterEach(async () => {
    await sender._destroy();
  });

}
