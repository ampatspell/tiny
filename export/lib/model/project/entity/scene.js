const Entity = require('../entity');
const array = require('./array');

const filtered = (scene, type) => array(scene.project.sortBy(scene.models.filter(model => model.baseType === type), 'json.index', 'asc'));

class Scene extends Entity {

  bind() {
    super.bind();
    let { json } = this;
    if(json.name) {
      this.name = json.name;
    }
    this.background = json.background;
    this.size = json.size;
    this.index = this.parent.scenes.indexOf(this);
    this.layers = filtered(this, 'scene/layer');
  }

}

module.exports = Scene;
