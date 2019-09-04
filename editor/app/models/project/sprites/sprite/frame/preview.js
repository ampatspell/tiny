import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { Pixel } from 'editor/utils/pixel';

export default EmberObject.extend({

  frame: null,

  size: readOnly('frame.size'),
  bytes: readOnly('frame.bytes'),

  canvas: computed('size', function() {
    let { size } = this;
    if(!size) {
      return;
    }
    let { width, height } = size;
    let canvas = document.createElement('canvas');
    canvas.style.imageRendering = 'pixelated';
    canvas.style.width = `${width * 2}px`;
    canvas.style.height = `${height * 2}px`;
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }).readOnly(),

  render() {
    let { canvas, bytes } = this;
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
        a = 255;
        c = 204;
      } else {
        a = 255;
        if(byte === Pixel.black) {
          c = 0;
        } else {
          c = 255;
        }
      }
      let i = idx * 4;
      data[i + 0] = c;
      data[i + 1] = c;
      data[i + 2] = c;
      data[i + 3] = a;
    });

    ctx.putImageData(image, 0, 0);
  },

  create() {
    this.render();
  }

});
