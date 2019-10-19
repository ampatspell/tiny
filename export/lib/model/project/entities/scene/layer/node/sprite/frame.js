const SpriteNode = require('../sprite');

class SpriteFrameNode extends SpriteNode {

  link() {
    super.link();
    this.frame = this.sprite.frames.byIdentifier(this.json.frame);
  }

}

module.exports = SpriteFrameNode;
