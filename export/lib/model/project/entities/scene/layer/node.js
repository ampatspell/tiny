const Entity = require('../../entity');

class Node extends Entity {

  constructor(project, json) {
    super(project, json);
    this.position = json.position;
  }

  get baseType() {
    return 'scene/layer/node';
  }

  link() {
    super.link();
    this.layer = this.parent;
    this.index = this.layer.nodes.models.indexOf(this);
  }

}

module.exports = Node;
