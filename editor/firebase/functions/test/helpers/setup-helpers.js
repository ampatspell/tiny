module.exports = function(ctx) {

  const path = require('path');
  const fs = require('fs');

  const readFile = (...args) => new Promise((resolve, reject) => {
    fs.readFile(...args, (err, content) => {
      if(err) {
        return reject(err);
      }
      return resolve(content);
    });
  });

  const resolve = name => path.join(__dirname, '..', 'files', name);

  ctx.files = {
    read: name => readFile(resolve(name))
  };

  return () => {};
}
