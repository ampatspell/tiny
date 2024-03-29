import Component from '../../../-component';
import { computed } from '@ember/object';

const backgrounds = [
  { value: 'black', label: 'Black' },
  { value: 'white', label: 'White' },
  { value: 'transparent', label: 'None' }
];

const background = () => computed(`backgrounds.@each.value`, 'model.background', function() {
  let array = this.backgrounds;
  let value = this.model.background;
  return array.findBy('value', value);
}).readOnly();

export default Component.extend({
  tagName: '',

  backgrounds,
  background: background(),

  actions: {
    background(background) {
      this.update('background', background.value);
    }
  }

});
