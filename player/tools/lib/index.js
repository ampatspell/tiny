module.exports = async (config, cb) => {
  let ctx = {
    cache:  require('./cache')(config),
    fetch:  require('./fetch')(config),
    write:  require('./write')(config),
    pixels: require('./pixels')
  };
  let runtime = require('./runtime');
  await runtime(() => cb(ctx));
}
