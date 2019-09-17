let config = require('../config');
let { run } = require('tiny-export');
let path = require('path');
let sprites = require('./sprites');
let scenes = require('./scenes');

let local = filename => path.join(__dirname, filename);

run(config, async runtime => {

  let payload = await runtime.project();

  let indent = (string, tabs) => {
    let prefix = new Array(tabs * 2).fill(' ').join('');
    return string.split('\n').map((line, idx) => {
      if(idx === 0) {
        return line;
      }
      return `${prefix}${line}`;
    }).join('\n');
  };

  let render = async ({ template, filename, props }) => {
    filename = filename || template;
    let file = ext => runtime.render(local(`${template}.${ext}.ejs`), Object.assign({ indent } ,props));
    await runtime.write(`${filename}.cpp`, file('cpp')); // setup variables
    await runtime.write(`${filename}.h`, file('h')); // externs
  }

  await Promise.all([
    sprites(payload, render),
    scenes(payload, render)
  ]);

});
