import Layer, { data } from './layer';

export default Layer.extend({

  typeName: 'Grid Layer',

  grid: data('grid.serialized'),

  clampNodePosition(node, position) {
    let { grid } = this;

    let clamp = (p, s) => Math.round(position[p] / grid[s]) * grid[s];
    let x = clamp('x', 'width');
    let y = clamp('y', 'height');

    return this._super(node, { x, y });
  }

});