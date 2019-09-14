const fs = require('./fs');

module.exports = config => {
  let { target } = config;
  return async (filename, content) => {
    await fs.writeFile(`${target}/${filename}`, content, 'utf-8');
  }
}
