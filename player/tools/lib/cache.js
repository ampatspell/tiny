const path = require('path');
const filename = path.join(__dirname, '..', '..', 'payload.json');
const fs = require('fs');

const save = json => {
  let string = JSON.stringify(json, null, 2);
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, string, 'utf-8', err => {
      if(err) {
        return reject(err);
      }
      resolve();
    });
  });
}

const retrieve = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      if(err) {
        return reject(err);
      }
      let json = JSON.parse(data);
      resolve(json);
    });
  });
}

module.exports = {
  save,
  retrieve
};
