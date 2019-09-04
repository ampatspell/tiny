import Node from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { Pixel } from 'editor/utils/pixel';

const pixel = {
  width: 16,
  height: 16
};

export default Node.extend({

  nodeClassName: 'shape',

  pixel,
  size: readOnly('frame.size'),
  bytes: readOnly('frame.bytes'),

  sceneFunc: computed('size', 'pixel', 'bytes', function() {
    let { size, pixel, bytes } = this;
    let width = size.width * pixel.width;
    let height = size.height * pixel.height;
    return ctx => {
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

        let x = 0;
        let y = 0;

        ctx.fill = `rgba(${c},${c},${c},${a})`;
        ctx.fillRect(x, y, size.width, size.height);
      });
    }
  }).readOnly(),

  props: computed('x', 'y', 'pixel', 'size', 'sceneFunc', function() {
    let { x, y, pixel, size, sceneFunc } = this;
    let width = size.width * pixel.width;
    let height = size.height * pixel.height;
    return { x, y, width, height, sceneFunc, draggable: true };
  }).readOnly(),

});
