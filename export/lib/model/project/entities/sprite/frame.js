const Entity = require('../entity');
const pixels = require('../../../../util/pixels');

class SpriteFrame extends Entity {

  constructor(project, json) {
    super(project, json);
    Object.defineProperty(this, 'bytes', { value: json.bytes });
  }

  link() {
    super.link();
    this.sprite = this.parent;
    this.index = this.sprite.frames.models.indexOf(this);
  }

  toPlusMaskString() {
    return pixels.toDrawPlusMaskString(this.bytes, this.sprite.size);
  }

}

module.exports = SpriteFrame;
