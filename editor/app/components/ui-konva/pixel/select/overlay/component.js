import Node from '../../../-node';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';

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

  isDrawing: false,
  state: null,

  _update(isDrawing, state) {
    state = assign({}, this.state, state);
    this.setProperties({ isDrawing, state });
    this.update(state);
  },

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
    this._update(true, { phase: 'drawing', x, y, width: 0, height: 0 });
  },

  onMouseleave(e) {
    e.cancelBubble = true;
    this._update(false, { phase: 'moving' });
  },

  onMouseup(e) {
    e.cancelBubble = true;
    this._update(false, { phase: 'moving' });
  },

  onMousemove(e) {
    if(!this.isDrawing) {
      return;
    }
    e.cancelBubble = true;

    let pixel = this.pixelForRelativePointerPosition(Math.round);
    let state = assign({}, this.state);

    let calc = key => Math.max(pixel[key] - state[key], 0);
    state.width = calc('x');
    state.height = calc('y');

    this._update(true, state);
  },

});
