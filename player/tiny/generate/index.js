let config = require('../config');
let { run } = require('tiny-export');
let sprites = require('./sprites');
let scene = require('./scene');
let path = require('path');

let template = filename => path.join(__dirname, filename);

run(config, async runtime => {

  let project = await runtime.project();

  await sprites(runtime, project);
  await scene(runtime, project.world.sceneByIdentifier('01'));

  // let rendered = runtime.render(template('test.h.ejs'), { foo, project });

});
