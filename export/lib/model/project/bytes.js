const pixels = require('../../util/pixels');

class Bytes {

  constructor(parent, raw, size) {
    Object.defineProperty(this, 'parent', { value: parent });
    Object.defineProperty(this, 'raw', { value: raw });
    this.size = size;
  }

  pixel(x, y) {
    return pixels.pixel(this.raw, x, y, this.size);
  }

  slice(frame) {
    let raw = new Uint8Array(frame.width * frame.height);
    for(let x = frame.x; x < frame.x + frame.width; x++) {
      for(let y = frame.y; y < frame.y + frame.height; y++) {
        raw[pixels.index(x - frame.x, y - frame.y, frame)] = pixels.pixel(this.raw, x, y, this.size);
      }
    }
    return new Bytes(this, raw, { width: frame.width, height: frame.height });
  }

  toPlusMaskString() {
    return pixels.toDrawPlusMaskString(this.raw, this.size);
  }

  toBitmapString() {
    return pixels.toDrawBitmapString(this.raw, this.size);
  }

}

module.exports = Bytes;
