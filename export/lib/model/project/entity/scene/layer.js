const Entity = require('../../entity');
const array = require('../array');

const filtered = (layer, type) => array(layer.project.sortBy(layer.models.filter(model => model.baseType === type), 'json.index', 'asc'));

class Layer extends Entity {

  get baseType() {
    return 'scene/layer';
  }

  bind() {
    super.bind();
    this.index = this.parent.layers.indexOf(this);
    this.nodes = filtered(this, 'scene/layer/node');
  }

}

module.exports = Layer;
