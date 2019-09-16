const ejs = require('ejs');
const path = require('path');
const fs = require('fs');

const render = (filename, props) => {
  filename = path.resolve(filename);
  try {
    let dirname = path.dirname(filename);
    let compiled = ejs.compile(fs.readFileSync(filename, 'utf-8'), { client: true });
    return compiled(props, null, (name, props) => render(path.join(dirname, `${name}.ejs`), props));
  } catch(err) {
    err.message = `${filename}: ${err.message}`;
    throw err;
  }
}

module.exports = render;
