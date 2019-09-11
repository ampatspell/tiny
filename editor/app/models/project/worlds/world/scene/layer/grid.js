import Layer, { data } from './layer';

export default Layer.extend({

  name: 'Grid',
  grid: data('grid.serialized'),

  clampNodePosition(node, position) {
    let { grid } = this;

    let { size } = node;
    console.log(size);

    let clamp = (p, s) => Math.round(position[p] / grid[s]) * grid[s];
    let x = clamp('x', 'width');
    let y = clamp('y', 'height');

    return { x, y };
  }

});
