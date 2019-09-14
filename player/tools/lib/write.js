const fs = require('./fs');
const path = require('path');

module.exports = config => {
  let { target } = config;
  return async (filename, content) => {
    let fullName = `${target}/${filename}`;
    await fs.mkdir(path.dirname(fullName));
    await fs.writeFile(fullName, content, 'utf-8');
  }
}
