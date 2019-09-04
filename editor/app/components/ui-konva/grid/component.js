import Node from '../-node';
import { computed } from '@ember/object';
import { Pixel } from 'editor/utils/pixel';

export default Node.extend({

  nodeClassName: 'shape',

  pixel: 16,
  size: null,
  bytes: null,

  disabled: false,

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

  hitFunc: computed(function() {
    return (ctx, node) => {
      ctx.beginPath();
      ctx.rect(0, 0, node.width(), node.height());
      ctx.closePath();
      ctx.fillStrokeShape(node);
    }
  }).readOnly(),

  props: computed('x', 'y', 'pixel', 'size', 'sceneFunc', 'hitFunc', function() {
    let { x, y, pixel, size, sceneFunc, hitFunc } = this;
    let width = size.width * pixel;
    let height = size.height * pixel;
    return { x, y, width, height, sceneFunc, hitFunc, listening: true };
  }).readOnly(),

  nodeAttributesChanged() {
    return true;
  },

  isDrawing: false,

  pixelForEvent(e) {
    let pos = this.getRelativePointerPosition();
    let { pixel, size } = this;
    let x = Math.floor(pos.x / pixel);
    let y = Math.floor(pos.y / pixel);
    let index = (y * size.width) + x;
    return { x, y, index };
  },

  targetPixelValueForEvent({ evt }) {
    let { shiftKey, metaKey } = evt;
    if(shiftKey) {
      return Pixel.transparent;
    } else if(metaKey) {
      return Pixel.white;
    } else {
      return Pixel.black;
    }
  },

  updatePixelForEvent(e) {
    let { index } = this.pixelForEvent(e);
    let value = this.targetPixelValueForEvent(e);
    this.update && this.update(index, value);
  },

  onMousedown(e) {
    if(this.disabled) {
      return;
    }
    e.cancelBubble = true;
    this.setProperties({ isDrawing: true });
    this.updatePixelForEvent(e);
  },

  onMouseup(e) {
    e.cancelBubble = true;
    this.setProperties({ isDrawing: false });
  },

  onMousemove(e) {
    if(!this.isDrawing) {
      return;
    }
    e.cancelBubble = true;
    this.updatePixelForEvent(e);
  },

});
