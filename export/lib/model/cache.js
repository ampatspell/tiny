const fs = require('../util/fs');

const replacer = (name, val) => {
  if(name === 'bytes') {
    return `... ${val.length} bytes`;
  }
  return val;
}

class Cache {

  constructor(config) {
    this.config = config;
  }

  async save(json) {
    let { config: { payload, readable } } = this;
    return Promise.all([
      fs.writeFile(payload, JSON.stringify(json), 'utf-8'),
      fs.writeFile(readable, JSON.stringify(json, replacer, 2), 'utf-8')
    ]);
  }

  async retrieve() {
    let { config: { payload } } = this;
    let data = await fs.readFile(payload, 'utf-8');
    return JSON.parse(data);
  }

}

module.exports = Cache;
