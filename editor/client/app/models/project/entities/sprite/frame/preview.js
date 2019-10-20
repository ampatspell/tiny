import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { Pixel } from 'editor/utils/pixel';
import { canvasToBlob } from 'editor/utils/canvas';

const canvas = () => computed('size', function() {
  let { size } = this;
  if(!size) {
    return;
  }
  let { width, height } = size;
  let canvas = document.createElement('canvas');
  canvas.style.imageRendering = 'pixelated';
  canvas.width = width;
  canvas.height = height;
  return canvas;
}).readOnly();

const render = (canvasKey, invert) => computed(canvasKey, 'bytes', function() {
  let canvas = this[canvasKey];
  let bytes = this.bytes;
  if(!canvas || !bytes) {
    return;
  }

  let { width, height } = canvas;
  let ctx = canvas.getContext('2d');

  let image = ctx.createImageData(width, height);
  let { data } = image;

  bytes.forEach((byte, idx) => {
    let c;
    let a;
    if(byte === Pixel.transparent) {
      a = 0;
      c = 0;
    } else {
      a = 255;
      if(byte === Pixel.black) {
        c = invert ? 255 : 0;
      } else {
        c = invert ? 0 : 255;
      }
    }
    let i = idx * 4;
    data[i + 0] = c;
    data[i + 1] = c;
    data[i + 2] = c;
    data[i + 3] = a;
  });

  ctx.putImageData(image, 0, 0);

  return canvas;
}).readOnly();

export default EmberObject.extend({

  frame: null,

  size: readOnly('frame.size'),
  bytes: readOnly('frame.bytes'),

  _rendered: canvas(),
  _inverted: canvas(),

  rendered: render('_rendered', false),
  inverted: render('_inverted', true),

  url: computed('rendered', function() {
    return this.rendered.toDataURL();
  }).readOnly(),

  blob(contentType) {
    return canvasToBlob(this.rendered, contentType);
  }

});
