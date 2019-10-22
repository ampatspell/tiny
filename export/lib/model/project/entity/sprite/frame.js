const Entity = require('../../entity');
const pixels = require('../../../../util/pixels');

class SpriteFrame extends Entity {

  bind() {
    super.bind();
    this.index = this.parent.frames.indexOf(this);
    Object.defineProperty(this, 'bytes', { value: this.json.bytes });
  }

  get size() {
    return this.parent.size;
  }

  pixel(x, y) {
    return pixels.pixel(this.bytes, x, y, this.size);
  }

  toPlusMaskString() {
    return pixels.toDrawPlusMaskString(this.bytes, this.size);
  }

}

module.exports = SpriteFrame;
