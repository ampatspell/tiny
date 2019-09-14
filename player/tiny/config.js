const path = require('path');

const root = path.join(__dirname, '..');

module.exports =  {
  target: path.join(root, 'src/generated'),
  cache:  {
    payload: path.join(root, 'payload-cache.json'),
    readable: path.join(root, 'payload-readable.json')
  },
  url: 'https://europe-west2-dev-tiny.cloudfunctions.net/export-world',
  token: 'Ny7qX8WIN5zW05mpPwqqWk43'
};
