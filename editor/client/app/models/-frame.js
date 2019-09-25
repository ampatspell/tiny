import { computed } from '@ember/object';
import { A } from '@ember/array';

export const frame = () => computed('position', 'size', function() {
  let { position, size } = this;
  if(!position || !size) {
    return;
  }
  let { x, y } = position;
  let { width, height } = size;
  return { x, y, width, height };
}).readOnly();

export const pixelFrame = (positionPixelKey, sizePixelKey) => {
  let deps = A([ positionPixelKey, sizePixelKey ]).compact();
  return computed('frame', ...deps, function() {
    let { frame } = this;
    if(!frame) {
      return;
    }
    let positionPixel = this.get(positionPixelKey);
    let sizePixel = this.get(sizePixelKey);
    if(!positionPixel) {
      return;
    }
    if(!sizePixel) {
      sizePixel = positionPixel;
    }
    let calc = (key, pixel) => frame[key] * pixel;
    return {
      x: calc('x', positionPixel),
      y: calc('y', positionPixel),
      width: calc('width', sizePixel),
      height: calc('height', sizePixel)
    };
  }).readOnly();
}
