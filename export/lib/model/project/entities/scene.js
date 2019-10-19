const Entity = require('./entity');
const Entities = require('./entities');

class Scene extends Entity {

  constructor(project, json) {
    super(project, json);
    this.name = json.name;
    this.background = json.background;
    this.size = json.size;
  }

  link() {
    super.link();
    this.layers = new Entities(this, this.models.filter(model => model.baseType === 'scene/layer'));
    this.layers.link();
  }

}

module.exports = Scene;
