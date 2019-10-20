const Node = require('../node');

class SpriteNode extends Node {

  bind() {
    super.bind();
    this.sprite = this.project.sprites.find(sprite => sprite.identifier === this.json.sprite);
  }

}

module.exports = SpriteNode;
