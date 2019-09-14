const pixel = (bytes, x, y, size) => bytes[y * size.width + x];

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

const toHexStrings = array => array.map(value => `0x${value.toString(16).padStart(2, '0')}`);

const toDrawPlusMaskString = (bytes, size) => toHexStrings(toDrawPlusMaskArray(bytes, size)).join(', ');

module.exports = {
  toDrawPlusMaskArray,
  toHexStrings,
  toDrawPlusMaskString
}
