import Layer, { data } from './layer';
import { computed } from '@ember/object';

export default Layer.extend({

  name: computed('grid', function() {
    let { grid } = this;
    if(grid) {
      return `Grid`;
    }
    return `Free`;
  }).readOnly(),

  grid: data('grid'),

  clampNodePosition(node, position) {
    if(!this.grid) {
      return position;
    }

    let { scene: { grid } } = this;

    let clamp = (p, s) => Math.round(position[p] / grid[s]) * grid[s];
    let x = clamp('x', 'width');
    let y = clamp('y', 'height');

    return { x, y };
  }

});
