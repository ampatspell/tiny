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
  let deps = A([ positionPixelKey, sizePixelKey ]).compact().uniq();
  return computed('frame', ...deps, function() {
    let { frame } = this;
    if(!frame) {
      return;
    }
    let positionPixel = this.get(positionPixelKey);
    if(!positionPixel) {
      return;
    }
    let sizePixel;
    if(sizePixelKey) {
      sizePixel = this.get(sizePixelKey);
    }
    if(!sizePixel) {
      sizePixel = 1;
    }
    let calc = (key, pixel) => frame[key] * pixel;
    return {
      x:      calc('x', positionPixel),
      y:      calc('y', positionPixel),
      width:  calc('width',  positionPixel * sizePixel),
      height: calc('height', positionPixel * sizePixel)
    };
  }).readOnly();
};

export const pixelSize = pixelKey => computed('size', pixelKey, function() {
  let size = this.get('size');
  let pixel = this.get(pixelKey);
  return  {
    x: 0,
    y: 0,
    width: size.width * pixel,
    height: size.height * pixel
  };
}).readOnly();

export const absolutePixel = (parentKey, selfKey) => computed(parentKey, selfKey, function() {
  let parent = this.get(parentKey);
  let self = this.get(selfKey);
  if(!self) {
    self = 1;
  }
  return parent * self;
}).readOnly();
