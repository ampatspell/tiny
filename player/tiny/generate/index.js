let config = require('../config');
let { run } = require('tiny-export');
let path = require('path');
let sprites = require('./sprites');

let template = filename => path.join(__dirname, filename);

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

  let render = async (name, props) => {
    let file = ext => runtime.render(template(`${name}.${ext}.ejs`), Object.assign({ indent } ,props));
    await Promise.all([
      runtime.write(`${name}.h`, file('h')),
      runtime.write(`${name}.cpp`, file('cpp')),
    ]);
  }

  await sprites(payload, render);

});
