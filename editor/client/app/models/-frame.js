import { computed } from '@ember/object';

export const frame = () => computed('position', 'size', function() {
  let { position, size } = this;
  if(!position || !size) {
    return;
  }
  let { x, y } = position;
  let { width, height } = size;
  return { x, y, width, height };
}).readOnly();

export const pixelFrame = (parentKey) => {
  return computed('frame', `${parentKey}.absolutePixel`, `absolutePixel`, function() {
    let { frame } = this;
    if(!frame) {
      return;
    }
    let positionPixel = this[parentKey].absolutePixel;
    let sizePixel = this.absolutePixel;
    let calc = (key, pixel) => frame[key] * pixel;
    return {
      x:      calc('x', positionPixel),
      y:      calc('y', positionPixel),
      width:  calc('width',  sizePixel),
      height: calc('height', sizePixel)
    };
  }).readOnly();
};

export const absolutePixel = (parentKey) => computed(`${parentKey}.pixel`, 'pixel', function() {
  let parent = this.get(`${parentKey}.pixel`);
  let self = this.pixel;
  if(!self) {
    self = 1;
  }
  return parent * self;
}).readOnly();

export const absolutePixelFrame = parentKey => computed(`${parentKey}.absolutePixelFrame`, 'pixelFrame', function() {
  let parent = this.get(`${parentKey}.absolutePixelFrame`);
  let frame = this.get('pixelFrame');
  return {
    x: parent.x + frame.x,
    y: parent.y + frame.y,
    width: frame.width,
    height: frame.height
  };
});
