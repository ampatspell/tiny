const Properties = require('./properties');

class Entity {

  constructor(project, json) {
    Object.defineProperty(this, 'project', { value: project });
    Object.defineProperty(this, 'json', { value: json });
    this.id = json.id;
    this.type = json.type;
    if(json.identifier) {
      this.identifier = json.identifier;
    }
    let properties = new Properties(this, json.properties);
    Object.defineProperty(this, 'properties', { value: properties, enumerable: properties.any });
  }

  bind() {
  }

  _bind() {
    let { id, json, project } = this;

    let parent;
    if(json.parent) {
      parent = this.project.models.find(model => model.id === json.parent);
    } else {
      parent = project;
    }

    let models = this.project.models.filter(model => model.json.parent === id);

    Object.defineProperty(this, 'parent', { value: parent });
    Object.defineProperty(this, 'models', { value: models });

    this.bind();

    this.classified = this.project.classify(this.identifier || this.index);

    this.models.map(model => model._bind());
  }

}

module.exports = Entity;
