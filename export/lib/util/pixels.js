const index = (x, y, size) => (y * size.width) + x;
const pixel = (bytes, x, y, size) => bytes[index(x, y, size)];

const toDrawPlusMaskArray = (bytes, size) => {
  let { width, height } = size;
  let pages = Math.ceil(height / 8);
  let data = [];
  for(let page = 0; page < pages; page++) {
    for(let x = 0; x < width; x++) {
      let sprite = 0;
      let mask = 0;
      for(let y = 0; y < 8; y++) {
        let px = pixel(bytes, x, page * 8 + y, size);
        // white
        if(px === 1) {
          sprite |= (1 << y);
        }
        // transparent
        if(px !== 0) {
          mask |= (1 << y);
        }
      }
      data.push(sprite);
      data.push(mask);
    }
  }
  return data;
};

const toDrawBitmapArray = (bytes, size) => {
  let { width, height } = size;
  let data = [];
  for(let x = 0; x < width; x++) {
    let byte = 0;
    for(let y = 0; y < height; y++) {
      let px = pixel(bytes, x, y, size);
      if(px !== 0) {
        byte |= (1 << y);
      }
    }
    data.push(byte);
  }
  return data;
}

const toHexStrings = array => array.map(value => `0x${value.toString(16).padStart(2, '0')}`);
const toDrawPlusMaskString = (bytes, size) => toHexStrings(toDrawPlusMaskArray(bytes, size)).join(', ');
const toDrawBitmapString = (bytes, size) => toHexStrings(toDrawBitmapArray(bytes, size)).join(', ');

module.exports = {
  index,
  pixel,
  toDrawPlusMaskArray,
  toHexStrings,
  toDrawPlusMaskString,
  toDrawBitmapArray,
  toDrawBitmapString
}
