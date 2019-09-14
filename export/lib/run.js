const wrap = require('./util/wrap');
const Runtime = require('./model/runtime');

module.exports = (config, cb) => {

  let runtime = new Runtime(config);
  wrap(() => cb(runtime));

}
