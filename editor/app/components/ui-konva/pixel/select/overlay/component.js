import Node from '../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  pixel: null,
  size: null,

  frame: computed('x', 'y', 'pixel', 'size', function() {
    let { x, y, pixel, size } = this;
    let width = size.width * pixel;
    let height = size.height * pixel;
    return { x, y, width, height };
  }).readOnly(),

  props: computed('frame', function() {
    let { frame } = this;
    return {
      ...frame,
      fill: 'rgba(255,0,0,0.1)'
    }
  }).readOnly(),

  isDrawing: false,

  onMousedown(e) {
    if(this.disabled) {
      return;
    }
    e.cancelBubble = true;
    this.setProperties({ isDrawing: true });
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
    console.log('draw');
  },

});
