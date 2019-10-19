class Entities {

  constructor(parent, models) {
    Object.defineProperty(this, 'parent', { value: parent });
    this.models = models;
  }

  link() {
    this.models.forEach(model => model.link());
  }

  byId(id) {
    return this.models.find(model => model.id === id);
  }

  byIdentifier(identifier) {
    return this.models.find(model => model.identifier === identifier);
  }

}

module.exports = Entities;
