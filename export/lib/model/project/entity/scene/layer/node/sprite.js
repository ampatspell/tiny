const Node = require('../node');

class SpriteNode extends Node {

  bind() {
    super.bind();
    let { json } = this;
    this.alignment = json.alignment;
    this.flip = json.flip;
    if(json.invert) {
      this.invert = !!json.invert;
    }
    if(json.omit) {
      this.omit = json.omit;
    }
    this.sprite = this.project.sprites.find(sprite => sprite.identifier === this.json.sprite);
  }

}

module.exports = SpriteNode;
