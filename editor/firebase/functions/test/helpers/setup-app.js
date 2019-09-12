module.exports = function(ctx) {

  let index = require('../../src');
  let app = index._app;

  ctx.index = index;
  ctx.app = app;

  return () => {};
}
