const Entity = require('./entity');
const Layers = require('./scene/layers');

class Scene extends Entity {

  constructor(project, json) {
    super(project, json);
    this.name = json.name;
    this.background = json.background;
    this.size = json.size;
  }

  link() {
    super.link();
    this.index = this.project.scenes.models.indexOf(this);
    this.layers = new Layers(this, this.models.filter(model => model.baseType === 'scene/layer'));
    this.layers.link();
  }

}

module.exports = Scene;
