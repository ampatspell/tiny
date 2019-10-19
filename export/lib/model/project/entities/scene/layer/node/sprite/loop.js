const SpriteNode = require('../sprite');

class SpriteLoopNode extends SpriteNode {

  link() {
    super.link();
    this.loop = this.sprite.loops.byIdentifier(this.json.loop);
  }

}

module.exports = SpriteLoopNode;
