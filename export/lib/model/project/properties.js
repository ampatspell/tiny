class Properties {

  constructor(parent, json) {
    Object.defineProperty(this, 'parent', { value: parent });
    Object.defineProperty(this, 'json', { value: json });
  }

  inspect() {
    let values = '';
    if(this.any) {
      values = ` ${this.keys.join(', ')} `;
    }
    return `Properties {${values}}`;
  }

  get any() {
    return this.keys.length > 0;
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
