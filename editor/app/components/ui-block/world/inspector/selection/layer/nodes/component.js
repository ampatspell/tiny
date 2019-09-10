import Component from '../-layer';
import { computed } from '@ember/object';

const grids = [
  { value: true, label: 'Grid' },
  { value: false, label: 'Pixel' }
];

const choice = (arrayKey, valueKey) => computed(`arrayKey.@each.value`, valueKey, function() {
  let array = this.get(arrayKey);
  if(!array) {
    return;
  }
  let value = this.get(valueKey);
  return array.findBy('value', value);
}).readOnly();

export default Component.extend({

  grids,
  grid: choice('grids', 'layer.grid'),

  actions: {
    grid({ value }) {
      this.update('grid', value);
    },
    createFillNode() {
      this.state.createNode({
        type: 'fill',
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 8,
          height: 8
        },
        color: 'black'
      });
    },
    createSpriteNode() {
      this.state.createNode({
        type: 'sprite',
        position: {
          x: 0,
          y: 0,
        }
      });
    },
  }

});
