import Node from '../-node';
import { computed } from '@ember/object';
import { Pixel } from 'editor/utils/pixel';

export default Node.extend({

  nodeClassName: 'shape',

  pixel: 16,
  size: null,
  bytes: null,

  sceneFunc: computed('size', 'pixel', 'bytes', function() {
    let { size, pixel, bytes } = this;
    return ctx => {
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.strokeRect(-0.5, -0.5, (size.width * pixel) + 1, (size.height * pixel) + 1);

      bytes.forEach((byte, idx) => {
        if(byte === Pixel.transparent) {
          return;
        }

        let c;
        if(byte === Pixel.black) {
          c = '#000';
        } else {
          c = '#fff';
        }

        let y = Math.floor(idx / size.width);
        let x = idx - (y * size.width);

        ctx.fillStyle = c;
        ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
      });
    }
  }).readOnly(),

  props: computed('x', 'y', 'pixel', 'size', 'sceneFunc', function() {
    let { x, y, pixel, size, sceneFunc } = this;
    let width = size.width * pixel;
    let height = size.height * pixel;
    return { x, y, width, height, sceneFunc, draggable: true };
  }).readOnly(),

  nodeAttributesChanged() {
    return true;
  },

});
