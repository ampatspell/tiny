import Node from '../../../-node';
import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'rect',

  pixel: null,
  size: null,
  state: null,
  isMoving: equal('state.phase', 'moving'),

  frame: computed('state', 'pixel', function() {
    let { state, pixel } = this;
    let calc = key => state[key] * pixel;
    let x = calc('x') - 0.5;
    let y = calc('y') - 0.5;
    let width = calc('width') + 1;
    let height = calc('height') + 1;
    return { x, y, width, height };
  }).readOnly(),

  props: computed('frame', 'isMoving', function() {
    let { frame, isMoving } = this;
    let strokeWidth = 1;
    if(frame.width === 0 && frame.height === 0) {
      strokeWidth = 0;
    }
    return {
      ...frame,
      fill: 'rgba(96,190,253, 0.3)',
      stroke: 'rgba(96,190,253, 0.5)',
      strokeWidth,
      listening: isMoving,
      draggable: isMoving
    }
  }).readOnly(),

  onDragstart() {
    this.begin();
  },

  onDragmove() {
    let { x, y } = this.nodeAttributes();
    let { pixel } = this;

    let pos = {
      x: Math.floor(x / pixel),
      y: Math.floor(y / pixel)
    };

    x = pos.x * pixel;
    y = pos.y * pixel;

    this.setNodeAttributes({ x, y });

    let current = this.pos;
    if(current && current.x === pos.x && current.y === pos.y) {
      return;
    }

    this.set('pos', pos);
    this.move(pos);
  },

  onDragend() {
    this.end();
  }

});
