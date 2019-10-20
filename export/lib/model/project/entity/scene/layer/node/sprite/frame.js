const SpriteNode = require('../sprite');

class SpriteFrameNode extends SpriteNode {

  bind() {
    super.bind();
    this.frame = this.sprite.frames.find(frame => frame.identifier === this.json.frame);
  }

}

module.exports = SpriteFrameNode;
