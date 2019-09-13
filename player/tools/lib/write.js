const fs = require('./fs');
const config = require('../config');
const outdent = require('outdent');

let { target } = config;

module.exports = async (filename, content) => {
  content = outdent.string(content);
  await fs.writeFile(`${target}/${filename}`, content, 'utf-8');
}
