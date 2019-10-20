const Entity = require('../../entity');

class SpriteLoop extends Entity {

  bind() {
    super.bind();
    this.index = this.parent.loops.indexOf(this);
    this.frames = this.json.frames.map(id => this.parent.frames.find(frame => frame.id === id));
  }

  toFrameIndexes() {
    return this.frames.map(frame => frame.index);
  }

  toFrameIndexesString() {
    return this.toFrameIndexes().join(', ');
  }

}

module.exports = SpriteLoop;
