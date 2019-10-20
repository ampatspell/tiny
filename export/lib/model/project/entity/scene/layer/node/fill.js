const Node = require('../node');

class FillNode extends Node {

  bind() {
    super.bind();
    this.size = this.json.size;
    this.color = this.json.color;
  }

}

module.exports = FillNode;
