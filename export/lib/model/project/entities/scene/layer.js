const Entity = require('../entity');
const Entities = require('../entities');

class Layer extends Entity {

  get baseType() {
    return 'scene/layer';
  }

  link() {
    super.link();
    this.scene = this.parent;
    this.nodes = new Entities(this, this.models.filter(model => model.baseType === 'scene/layer/node'));
    this.nodes.link();
  }

}

module.exports = Layer;
