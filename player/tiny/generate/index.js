let config = require('../config');
let { run } = require('tiny-export');
let sprites = require('./sprites');
let scene = require('./scene');

run(config, async runtime => {

  let project = await runtime.project();

  await sprites(runtime, project);
  await scene(runtime, project.world.sceneByIdentifier('01'));

});
