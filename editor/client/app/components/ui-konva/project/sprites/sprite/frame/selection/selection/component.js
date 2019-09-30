import Node from '../../../../../../-node';
import { equal, readOnly, not, and } from '@ember/object/computed';
import { computed } from '@ember/object';

const observe = [ 'frame', 'moving' ];

export default Node.extend({

  nodeClassName: 'rect',
  observe,

  model: null,
  sprite: readOnly('model.sprite'),
  pixel: readOnly('sprite.render.pixel'),

  state: null,
  moving: equal('state.phase', 'moving'),

  frame: computed('state', 'pixel', function() {
    let { state, pixel } = this;
    let calc = key => state[key] * pixel;
    let x = calc('x') - 0.5;
    let y = calc('y') - 0.5;
    let width = calc('width') + 1;
    let height = calc('height') + 1;
    return { x, y, width, height };
  }).readOnly(),

  props: computed('frame', 'moving', function() {
    let { frame, moving } = this;
    return {
      ...frame,
      fill: 'rgba(96,190,253, 0.3)',
      stroke: 'rgba(96,190,253, 0.5)',
      strokeWidth: 1,
      listening: moving,
      draggable: true
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
