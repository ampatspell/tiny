const fs = require('./fs');

module.exports = config => {
  let { cache } = config;

  const replacer = (name, val) => {
    if(name === 'bytes') {
      return `... ${val.length} bytes`;
    }
    return val;
  }

  const save = async json => {
    return Promise.all([
      fs.writeFile(cache.payload, JSON.stringify(json), 'utf-8'),
      fs.writeFile(cache.readable, JSON.stringify(json, replacer, 2), 'utf-8')
    ]);
  }

  const retrieve = async () => {
    let data = await fs.readFile(cache.payload, 'utf-8');
    return JSON.parse(data);
  }

  return {
    save,
    retrieve
  };
}
