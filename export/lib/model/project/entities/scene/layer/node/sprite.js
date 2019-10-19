const Node = require('../node');

class SpriteNode extends Node {

  constructor(project, json) {
    super(project, json);
    this.alignment = json.alignment;
    this.flip = json.flip;
  }

  link() {
    super.link();
    this.sprite = this.project.sprites.byIdentifier(this.json.sprite);
  }

}

module.exports = SpriteNode;
