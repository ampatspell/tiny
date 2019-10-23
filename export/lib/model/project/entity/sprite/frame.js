const Entity = require('../../entity');
const Bytes = require('../../bytes');

class SpriteFrame extends Entity {

  bind() {
    super.bind();
    this.index = this.parent.frames.indexOf(this);
    this.bytes = new Bytes(this, new Uint8Array(this.json.bytes), this.size);
  }

  get size() {
    return this.parent.size;
  }

}

module.exports = SpriteFrame;
