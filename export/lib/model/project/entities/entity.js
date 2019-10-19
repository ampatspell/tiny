const Properties = require('../properties')
const classify = require("underscore.string/classify");

class Entity {

  constructor(project, json) {
    Object.defineProperty(this, 'project', { value: project });
    Object.defineProperty(this, 'json', { value: json });
    let { id, type, identifier, parent, properties } = json;
    this.id = id;
    this.type = type;
    if(identifier) {
      this.identifier = identifier;
      this.classifiedIdentifier = classify(identifier);
    }
    Object.defineProperty(this, '_parent', { value: parent });
    properties = new Properties(this, properties);
    Object.defineProperty(this, 'properties', { value: properties, enumerable: properties.any });
  }

  link() {
    let { project, _parent } = this;
    if(_parent) {
      Object.defineProperty(this, 'parent', { value: project.entityById(_parent) });
    }
    let models = project.models.filter(model => model._parent === this.id);
    Object.defineProperty(this, 'models', { value: models });
  }

  get project() {
    return this.entities.project;
  }

}

module.exports = Entity;
