let config = require('./config');
let { run } = require('tiny-export');
let path = require('path');

let local = filename => path.join(__dirname, filename);

run(config, async runtime => {

  let project = await runtime.project();

  project.loops = [];
  project.sprites.forEach((sprite, s) => {
    sprite.variable = `sprite_${s}`;
    sprite.loops.forEach((loop, l) => {
      loop.variable = `${sprite.variable}_loop_${l}`;
      project.loops.push(loop);
    });
  });

  //

  let render = async ({ template, filename, props }) => {
    filename = filename || template;
    let file = ext => runtime.render(local(`templates/${template}.${ext}.ejs`), props);
    await runtime.write(`${filename}.cpp`, file('cpp')); // setup variables
    await runtime.write(`${filename}.h`, file('h')); // externs
  }

  await Promise.all([
    render({ template: 'sprites', props: { project } })
  ]);

});
