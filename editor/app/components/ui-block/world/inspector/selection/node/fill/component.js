import Component from '../-node';
import { computed } from '@ember/object';

const fills = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' }
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

  fills,
  fill: choice('fills', 'node.color'),

  actions: {
    fill({ value }) {
      this.update('color', value);
    }
  }

});
