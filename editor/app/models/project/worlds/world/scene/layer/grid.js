import Layer from './layer';

export default Layer.extend({

  name: 'Grid',

  clampNodePosition(node, position) {
    let { scene: { grid } } = this;

    let clamp = (p, s) => Math.round(position[p] / grid[s]) * grid[s];
    let x = clamp('x', 'width');
    let y = clamp('y', 'height');

    return { x, y };
  }

});
