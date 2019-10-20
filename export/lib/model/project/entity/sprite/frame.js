const Entity = require('../../entity');
const pixels = require('../../../../util/pixels');

class SpriteFrame extends Entity {

  bind() {
    super.bind();
    this.index = this.parent.frames.indexOf(this);
    Object.defineProperty(this, 'bytes', { value: this.json.bytes });
  }

  toPlusMaskString() {
    return pixels.toDrawPlusMaskString(this.bytes, this.parent.size);
  }

}

module.exports = SpriteFrame;
