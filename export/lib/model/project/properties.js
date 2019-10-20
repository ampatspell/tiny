class Properties {

  constructor(parent, json) {
    Object.defineProperty(this, 'parent', { value: parent });
    Object.defineProperty(this, 'json', { value: json });
    this.keys = Object.keys(json);
  }

  get any() {
    return this.keys.length > 0;
  }

  get all() {
    return this.json;
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
