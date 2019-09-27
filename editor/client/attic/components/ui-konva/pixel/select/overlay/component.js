import Node from '../../../-node';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import { equal } from '@ember/object/computed';

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
      fill: '#60befd',
      opacity: 0.1
    }
  }).readOnly(),

  state: null,
  isDrawing: equal('state.phase', 'drawing'),

  pixelForRelativePointerPosition(round) {
    let pos = this.getRelativePointerPosition();
    let { pixel } = this;
    let x = round(pos.x / pixel);
    let y = round(pos.y / pixel);
    return { x, y };
  },

  onMousedown(e) {
    if(this.disabled) {
      return;
    }
    e.cancelBubble = true;

    let { x, y } = this.pixelForRelativePointerPosition(Math.floor);
    this.begin({ x, y });
  },

  onMouseleave(e) {
    e.cancelBubble = true;
    this.end();
  },

  onMouseup(e) {
    e.cancelBubble = true;
    this.end();
  },

  onMousemove(e) {
    if(!this.isDrawing) {
      return;
    }
    e.cancelBubble = true;

    let pixel = this.pixelForRelativePointerPosition(Math.round);
    let state = assign({}, this.state);

    let calc = key => Math.max(pixel[key] - state[key], 0);
    let width = calc('x');
    let height = calc('y');

    this.update({ width, height });
  },

});
