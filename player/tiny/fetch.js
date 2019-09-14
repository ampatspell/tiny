let config = require('./config');
let { run } = require('tiny-export');

run(config, async runtime => {

  await runtime.fetch();

});
