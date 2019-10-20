const Entity = require('../entity');
const Entities = require('../entities');

class SpriteLoop extends Entity {

  link() {
    super.link();
    this.sprite = this.parent;
    this.index = this.sprite.loops.models.indexOf(this);
    this.frames = new Entities(this, this.json.frames.map(id => this.sprite.frames.byId(id)));
  }

  toFrameIndexes() {
    return this.frames.map(frame => frame.index);
  }

  toFrameIndexesString() {
    return this.toFrameIndexes().join(', ');
  }

}

module.exports = SpriteLoop;
