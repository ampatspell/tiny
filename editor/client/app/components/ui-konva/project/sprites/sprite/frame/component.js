import Node from '../../../../-node';
import { Pixel, fromIndex, toIndex } from 'editor/utils/pixel';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

const observe = [ 'pixelFrame', 'sceneFunc', 'disabled' ];

export default Node.extend({

  observe,
  nodeClassName: 'shape',

  model: null,

  pixel: readOnly('sprite.absolutePixel'),
  frame: readOnly('sprite.frame'),
  bytes: readOnly('model.bytes'),

  sceneFunc: computed('frame', 'pixel', 'bytes', function() {
    let { frame, pixel, bytes } = this;
    return ctx => {
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.strokeRect(-0.5, -0.5, (frame.width * pixel) + 1, (frame.height * pixel) + 1);

      if(!bytes) {
        return;
      }

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

        let { x, y } = fromIndex(idx, frame);

        ctx.fillStyle = c;
        ctx.fillRect(x * pixel, y * pixel, pixel, pixel);
      });
    }
  }).readOnly(),

  hitFunc: computed(function() {
    return (ctx, node) => {
      ctx.beginPath();
      ctx.rect(0, 0, node.width(), node.height());
      ctx.closePath();
      ctx.fillStrokeShape(node);
    }
  }).readOnly(),

  disabled: false,

  props: computed('frame', 'pixel', 'sceneFunc', 'hitFunc', 'disabled', function() {
    let { frame, pixel, sceneFunc, hitFunc, disabled } = this;
    return {
      width: frame.width * pixel,
      height: frame.height * pixel,
      sceneFunc,
      hitFunc,
      listening: !disabled
    };
  }).readOnly(),

  nodeAttributesChanged() {
    return true;
  },

  // isDrawing: false,

  // pixelForRelativePointerPosition() {
  //   let pos = this.getRelativePointerPosition();
  //   let { pixel, size } = this;
  //   let x = Math.floor(pos.x / pixel);
  //   let y = Math.floor(pos.y / pixel);
  //   let index = toIndex(x, y, size);
  //   return { x, y, index };
  // },

  // targetPixelValueForEvent({ evt }) {
  //   let { shiftKey, metaKey } = evt;
  //   if(shiftKey) {
  //     return Pixel.transparent;
  //   } else if(metaKey) {
  //     return Pixel.white;
  //   } else {
  //     return Pixel.black;
  //   }
  // },

  // updatePixelForEvent(e) {
  //   let { index } = this.pixelForRelativePointerPosition();
  //   let value = this.targetPixelValueForEvent(e);
  //   this.update && this.update(index, value);
  // },

  // onMousedown(e) {
  //   if(this.disabled) {
  //     return;
  //   }
  //   e.cancelBubble = true;
  //   this.setProperties({ isDrawing: true });
  //   this.updatePixelForEvent(e);
  // },

  // onMouseup(e) {
  //   e.cancelBubble = true;
  //   this.setProperties({ isDrawing: false });
  // },

  // onMouseleave() {
  //   this.setProperties({ isDrawing: false });
  // },

  // onMousemove(e) {
  //   if(!this.isDrawing) {
  //     return;
  //   }
  //   e.cancelBubble = true;
  //   this.updatePixelForEvent(e);
  // },


});
