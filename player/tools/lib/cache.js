const path = require('path');
const filename = path.join(__dirname, '..', '..', 'payload.json');
const fs = require('./fs');

const save = json => {
  let string = JSON.stringify(json, null, 2);
  return fs.writeFile(filename, string, 'utf-8');
}

const retrieve = async () => {
  let data = await fs.readFile(filename, 'utf-8');
  return JSON.parse(data);
}

module.exports = {
  save,
  retrieve
};
