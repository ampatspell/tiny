import Node from '../../../-node';
import { computed } from '@ember/object';

export default Node.extend({

  nodeClassName: 'rect',

  pixel: null,
  size: null,
  state: null,

  frame: computed('state', 'pixel', function() {
    let { state, pixel } = this;
    let calc = key => state[key] * pixel;
    let x = calc('x') - 0.5;
    let y = calc('y') - 0.5;
    let width = calc('width') + 1;
    let height = calc('height') + 1;
    return { x, y, width, height };
  }).readOnly(),

  props: computed('frame', 'state', function() {
    let { frame, state } = this;
    let draggable = state && state.phase === 'moving';
    return {
      ...frame,
      fill: 'rgba(96,190,253, 0.3)',
      stroke: 'rgba(96,190,253, 0.5)',
      strokeWidth: 1,
      listening: draggable,
      draggable
    }
  }).readOnly(),

  onDragmove() {
    let { x, y } = this.nodeAttributes();
    let { pixel, state } = this;

    let pos = {
      x: Math.round(x / pixel),
      y: Math.round(y / pixel)
    };

    x = pos.x * pixel;
    y = pos.y * pixel;

    this.setNodeAttributes({ x, y });

    console.log(state, pos);
  }

});
