import Component from '../../../-component';
import { computed } from '@ember/object';

const colors = [
  { value: undefined, label: 'None' },
  { value: 'black',   label: 'Black' },
  { value: 'white',   label: 'White' },
];

const color = () => computed(`colors.@each.value`, 'model.omit', function() {
  let array = this.colors;
  let value = this.model.omit;
  return array.findBy('value', value);
}).readOnly();

export default Component.extend({
  tagName: '',

  colors,
  color: color(),

  actions: {
    color(color) {
      this.update('omit', color.value);
    }
  }

});
