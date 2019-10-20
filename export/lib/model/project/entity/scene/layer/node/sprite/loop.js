const SpriteNode = require('../sprite');

class SpriteLoopNode extends SpriteNode {

  bind() {
    super.bind();
    this.loop = this.sprite.loops.find(loop => loop.identifier === this.json.loop);
  }

}

module.exports = SpriteLoopNode;
