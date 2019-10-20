const Entity = require('../entity');
const Nodes = require('./layer/nodes');

class Layer extends Entity {

  get baseType() {
    return 'scene/layer';
  }

  link() {
    super.link();
    this.scene = this.parent;
    this.index = this.scene.layers.models.indexOf(this);
    this.nodes = new Nodes(this, this.models.filter(model => model.baseType === 'scene/layer/node'));
    this.nodes.link();
  }

}

module.exports = Layer;
