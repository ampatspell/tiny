import Component from '../../../-component';
import { computed } from '@ember/object';

const pixels = [ 1, 2, 4, 8, 16 ].map(value => ({ value, label: `${value}x` }))

const pixel = () => computed(`pixels.@each.value`, 'model.pixel', function() {
  return this.pixels.findBy('value', this.model.pixel);
}).readOnly();

export default Component.extend({
  tagName: '',

  pixels,
  pixel: pixel(),

  actions: {
    pixel(pixel) {
      this.update('pixel', pixel.value);
    }
  }

});
