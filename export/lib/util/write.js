const fs = require('./fs');
const path = require('path');

module.exports = async (filename, content) => {
  await fs.mkdir(path.dirname(filename));
  await fs.writeFile(filename, content, 'utf-8');
}
