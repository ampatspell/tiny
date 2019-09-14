module.exports = async (config, cb) => {

  let cache = require('./cache')(config);
  let fetch = require('./fetch')(config);
  let write = require('./write')(config);
  let pixels = require('./pixels');
  let project = require('./model');

  let ctx = {
    cache,
    fetch,
    write,
    pixels,
    project
  };

  let runtime = require('./runtime');

  await runtime(() => cb(ctx));

}
