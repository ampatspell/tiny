const parent = require('../config');
const path = require('path');
const root = path.join(__dirname, '..');

module.exports =  Object.assign({
  target: path.join(root, 'src/generated'),
  cache:  {
    payload: path.join(root, 'payload-cache.json'),
    readable: path.join(root, 'payload-readable.json')
  }
}, parent);
