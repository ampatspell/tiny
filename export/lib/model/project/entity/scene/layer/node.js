const Entity = require('../../../entity');

class Node extends Entity {

  get baseType() {
    return 'scene/layer/node';
  }

  bind() {
    super.bind();
    this.position = this.json.position;
    this.index = this.parent.nodes.indexOf(this);
  }

}

module.exports = Node;
