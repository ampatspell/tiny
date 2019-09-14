let config = require('./config');
let runtime = require('./lib');

runtime(config, async ctx => {

  let json = await ctx.fetch();
  await ctx.cache.save(json);

});
