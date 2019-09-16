class Loop {

  constructor(sprite, json) {
    Object.defineProperty(this, 'sprite', { value: sprite });
    let { identifier, frames } = json;
    this.identifier = identifier;
    this.frames = frames.map(frame => sprite.frames[frame]);
  }

  toFrameIndexes() {
    return this.frames.map(frame => frame.index);
  }

  toFrameIndexesString() {
    return this.toFrameIndexes().join(', ');
  }

}

module.exports = Loop;