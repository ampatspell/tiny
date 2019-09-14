const Frame = require('./frame');
const Loop = require('./loop');

class Sprite {

  constructor(model, json) {
    Object.defineProperty(this, 'model', { value: model });
    let { identifier, size, frames, loops } = json;
    this.identifier = identifier;
    this.size = size;
    this.frames = frames.map(frame => new Frame(this, frame));
    this.loops = loops.map(loop => new Loop(this, loop));
  }

  frameByIdentifier(identifier) {
    return this.frames.find(frame => frame.identifier === identifier);
  }

  loopByIdentifier(identifier) {
    return this.loops.find(loop => loop.identifier === identifier);
  }

  toPlusMaskString() {
    let { size, frames } = this;
    let data = frames.map(frame => frame.toPlusMaskString())
    return [
      `// ${frames.length} ${frames.length === 1 ? 'frame' : 'frames'}`,
      `${size.width}, ${size.height},`,
      data.map((row, idx) => {
        return [
          `// #${idx}`,
          row
        ].join('\n');
      }).join(',\n')
    ].join('\n');
  }

}

module.exports = Sprite;
