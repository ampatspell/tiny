import Component from '../../-component';
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

  backgrounds,
  background: background(),

  deleteConfirmation: 'Sure you want to delete this scene?',

  actions: {
    background(background) {
      this.update('background', background.value);
    },
    createGridLayer() {
      this.model.layers.create({ type: 'grid', grid: { width: 8, height: 8 } });
    },
    createPixelLayer() {
      this.model.layers.create({ type: 'pixel' });
    }
  }

});
