import Layer, { data } from './layer';
import { computed } from '@ember/object';

export default Layer.extend({

  name: 'Nodes',
  grid: data('grid'),

  description: computed('grid', function() {
    let { grid } = this;
    return grid ? 'Snaps to Grid' : 'Snaps to Pixel';
  }).readOnly(),

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
