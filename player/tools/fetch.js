let config = require('./config');
let fetch = require('./lib/fetch');
let runtime = require('./lib/runtime');
let { save } = require('./lib/cache');

runtime(async () => {

  let { url, token } = config;
  let json = await fetch(url, token);
  await save(json);

});
