const pixels = require('../pixels');

class Frame {

  constructor(sprite, json) {
    Object.defineProperty(this, 'sprite', { value: sprite });
    let { identifier, bytes } = json;
    this.identifier = identifier;
    Object.defineProperty(this, 'bytes', { value: bytes });
  }

  get index() {
    return this.sprite.frames.indexOf(this);
  }

  toPlusMaskString() {
    return pixels.toDrawPlusMaskString(this.bytes, this.sprite.size);
  }

}

module.exports = Frame;
