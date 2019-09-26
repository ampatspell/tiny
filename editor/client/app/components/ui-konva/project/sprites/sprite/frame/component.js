import Node from '../../../../-node';
import { Pixel, fromIndex, toIndex } from 'editor/utils/pixel';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

const observe = [ 'frame', 'sceneFunc', 'hitFunc', 'disabled' ];

export default Node.extend({

  nodeClassName: 'shape',
  observe,

  model: null,

  pixel: readOnly('sprite.render.pixel'),
  frame: readOnly('sprite.render.frame'),
  size: readOnly('sprite.size'),
  bytes: readOnly('model.bytes'),

  sceneFunc: computed('size', 'pixel', 'bytes', function() {
    let { size, pixel, bytes } = this;
    return ctx => {
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.strokeRect(-0.5, -0.5, (size.width * pixel) + 1, (size.height * pixel) + 1);

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

        let { x, y } = fromIndex(idx, size);

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

  props: computed('frame', 'sceneFunc', 'hitFunc', 'disabled', function() {
    let { frame, sceneFunc, hitFunc, disabled } = this;
    return {
      width: frame.width,
      height: frame.height,
      sceneFunc,
      hitFunc,
      listening: !disabled
    };
  }).readOnly(),

  nodeAttributesChanged() {
    return true;
  },

  isDrawing: false,

  pixelForRelativePointerPosition() {
    let pos = this.getRelativePointerPosition();
    let { pixel, size } = this;
    let x = Math.floor(pos.x / pixel);
    let y = Math.floor(pos.y / pixel);
    let index = toIndex(x, y, size);
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
    let { index } = this.pixelForRelativePointerPosition();
    let value = this.targetPixelValueForEvent(e);
    this.model.setPixel(index, value);
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

  onMouseleave() {
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
