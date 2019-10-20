import Component from '../../../-component';
import { computed } from '@ember/object';

const colors = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'green', label: 'Green' },
  { value: 'red',   label: 'Red' }
];

const color = () => computed(`colors.@each.value`, 'model.color', function() {
  let array = this.colors;
  let value = this.model.color;
  return array.findBy('value', value);
}).readOnly();

export default Component.extend({
  tagName: '',

  colors,
  color: color(),

  actions: {
    color(color) {
      this.update('color', color.value);
    }
  }

});
