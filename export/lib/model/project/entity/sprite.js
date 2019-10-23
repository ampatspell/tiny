const Entity = require('../entity');
const array = require('./array');

const filtered = (sprite, type) => array(sprite.project.sortBy(sprite.models.filter(model => model.type === type), 'json.index', 'asc'));

class Sprite extends Entity {

  bind() {
    super.bind();
    this.index = this.parent.sprites.indexOf(this);
    this.size = this.json.size;
    this.frames = filtered(this, 'sprite/frame');
    this.loops = filtered(this, 'sprite/loop');
  }

  toPlusMaskString() {
    let { size, frames } = this;
    let data = frames.map(frame => frame.bytes.toPlusMaskString())
    return [
      `${size.width}, ${size.height},`,
      data.join(',\n')
    ].join('\n');
  }

}

module.exports = Sprite;
