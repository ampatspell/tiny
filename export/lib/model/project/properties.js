class Properties {

  constructor(json) {
    Object.defineProperty(this, 'json', { value: json });
  }

  get all() {
    return this.json;
  }

  get keys() {
    return Object.keys(this.json);
  }

  get(key, def) {
    let value = this.json[key];
    if(value === undefined) {
      return def;
    }
    return value;
  }

}

module.exports = Properties;
