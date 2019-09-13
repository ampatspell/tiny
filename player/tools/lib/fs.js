const fs = require('fs');

const writeFile = (...args) => new Promise((resolve, reject) => {
  fs.writeFile(...args, err => {
    if(err) {
      return reject(err);
    }
    resolve();
  });
});

const readFile = (...args) => new Promise((resolve, reject) => {
  fs.readFile(...args, (err, data) => {
    if(err) {
      return reject(err);
    }
    resolve(data);
  });
});

module.exports = {
  writeFile,
  readFile
};
