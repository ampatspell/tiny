import Component from '../../../../../../-component';
import { computed } from '@ember/object';

const fills = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'green', label: 'Green' },
  { value: 'red',   label: 'Red' }
];

const fill = () => computed(`fills.@each.value`, 'model.color', function() {
  let value = this.model.color;
  return this.fills.findBy('value', value);
}).readOnly();

export default Component.extend({

  fills,
  fill: fill(),

  actions: {
    fill({ value }) {
      this.update('color', value);
    }
  }

});
