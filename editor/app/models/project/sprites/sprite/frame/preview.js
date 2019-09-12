import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { Pixel } from 'editor/utils/pixel';
import { canvasToBlob } from 'editor/utils/canvas';

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
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }).readOnly(),

  rendered: computed('canvas', 'bytes', function() {
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
        a = 0;
        c = 0;
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

    return canvas;
  }).readOnly(),

  opaque: computed('rendered', function() {
    let { rendered } = this;
    if(!rendered) {
      return;
    }
    let canvas = document.createElement('canvas');
    canvas.width = rendered.width;
    canvas.height = rendered.height;

    let ctx = canvas.getContext('2d');

    let fill = color => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    fill('#fff');
    fill('rgba(0,0,0,0.1)');

    ctx.drawImage(rendered, 0, 0);

    return canvas;
  }).readOnly(),

  url: computed('rendered', function() {
    return this.rendered.toDataURL();
  }).readOnly(),

  blob(contentType) {
    return canvasToBlob(this.rendered, contentType);
  }

});
