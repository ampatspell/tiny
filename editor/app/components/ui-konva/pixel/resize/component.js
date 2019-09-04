import Node from '../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'group',

  disabled: false,

  pixel: null,
  size: null,

  color: '#60befd',

  bounds: computed('pixel', 'size', function() {
    let { pixel, size } = this;
    if(!pixel || !size) {
      return;
    }
    let width = size.width * pixel;
    let height = size.height * pixel;
    let x = 0;
    let y = 0;
    return { x, y, width, height };
  }).readOnly(),

  position: computed('bounds', function() {
    let { bounds } = this;
    if(!bounds) {
      return;
    }
    let { x, y, width, height } = bounds;
    let calc = (position, size) => ({ min: position - 0.5, mid: position + (size / 2) + 0.5, max: position + size + 0.5 });
    return {
      x: calc(x, width),
      y: calc(y, height)
    };
  }).readOnly(),

  // props: computed('x', 'y', 'pixel', 'size', 'sceneFunc', 'hitFunc', function() {
  //   return { x, y, width, height, sceneFunc, hitFunc, listening: true };
  // }).readOnly(),

  // nodeAttributesChanged() {
  //   return true;
  // },

  // isDrawing: false,

  // pixelForRelativePointerPosition() {
  //   let pos = this.getRelativePointerPosition();
  //   let { pixel, size } = this;
  //   let x = Math.floor(pos.x / pixel);
  //   let y = Math.floor(pos.y / pixel);
  //   let index = (y * size.width) + x;
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

  // onMousemove(e) {
  //   if(!this.isDrawing) {
  //     return;
  //   }
  //   e.cancelBubble = true;
  //   this.updatePixelForEvent(e);
  // },

});
