class Property {

  constructor({ key, value }) {
    this.key = key;
    this.value = value;
  }

  get(def) {
    let { value } = this;
    if(value === null) {
      return def;
    }
    return value;
  }

}

class Properties {

  constructor(json) {
    Object.defineProperty(this, 'json', { value: json });
    this.array = json.map(item => new Property(item));
  }

  property(key) {
    return this.array.find(prop => prop.key === key);
  }

  properties(key) {
    return this.array.filter(prop => prop.key === key);
  }

  get(key, def) {
    let property = this.property(key);
    if(!property) {
      return def;
    }
    return property.get(def);
  }

  all(key, def) {
    return this.properties(key).map(prop => prop.get(def));
  }

}

module.exports = Properties;
