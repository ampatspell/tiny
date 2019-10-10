import Node from '../../../../../-node';
import { Pixel, fromIndex, toIndex } from 'editor/utils/pixel';
import { readOnly, not, and } from '@ember/object/computed';
import { computed } from '@ember/object';

const observe = [ 'frame', 'sceneFunc', 'hitFunc' ];

const backgrounds = {
  'transparent': null,
  'black':       '#222',
  'white':       '#fff'
};

export default Node.extend({

  nodeClassName: 'shape',
  observe,

  model: null,
  sprite: null,

  // selected: readOnly('sprite.isSelected'),
  // editing: readOnly('sprite.isEditing'),
  // enabled: not('disabled'),
  // editable: and('editing', 'enabled', 'model'),

  disabled: true,

  pixel: readOnly('sprite.render.pixel'),
  frame: readOnly('sprite.render.frame'),
  size: readOnly('sprite.size'),
  background: readOnly('sprite.background'),

  bytes: readOnly('model.bytes'),

  isDrawing: false,

  sceneFunc: computed('size', 'pixel', 'bytes', 'background', function() {
    let { size, pixel, bytes, background } = this;
    return ctx => {
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.strokeRect(-0.5, -0.5, (size.width * pixel) + 1, (size.height * pixel) + 1);

      let fill = backgrounds[background];
      if(fill) {
        ctx.fillStyle = fill;
        ctx.fillRect(0, 0, size.width * pixel, size.height * pixel);
      }

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

  props: computed('frame', 'sceneFunc', function() {
    let { frame: { width, height }, sceneFunc } = this;
    return {
      width,
      height,
      sceneFunc,
      hitFunc: (ctx, node) => {
        ctx.beginPath();
        ctx.rect(0, 0, node.width(), node.height());
        ctx.closePath();
        ctx.fillStrokeShape(node);
      }
    };
  }).readOnly(),

  nodeAttributesChanged() {
    return true;
  },

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
    // if(!this.editable || !this.selected) {
    //   return;
    // }
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
