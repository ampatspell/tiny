const Node = require('../node');

class FillNode extends Node {

  constructor(project, json) {
    super(project, json);
    this.size = json.size;
    this.color = json.color;
  }

}

module.exports = FillNode;
