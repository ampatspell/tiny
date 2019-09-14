const fs = require('./fs');

module.exports = config => {
  let { cache } = config;

  const save = json => {
    let string = JSON.stringify(json, null, 2);
    return fs.writeFile(cache, string, 'utf-8');
  }

  const retrieve = async () => {
    let data = await fs.readFile(cache, 'utf-8');
    return JSON.parse(data);
  }

  return {
    save,
    retrieve
  };
}
