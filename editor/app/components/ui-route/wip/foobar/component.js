import Component from '@ember/component';
import { computed } from '@ember/object';
import { Pixel } from '../../../../models/pixels';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-foobar' ],

  ready: false,

  pixels: computed(function() {
    let model = this.store.models.create('pixels', { path: 'pixels/one' });
    model.load();
    return model;
  }).readOnly(),

  actions: {
    update(pixel, value) {
      pixel.update(value);
    },
    fill(value) {
      this.pixels.fill(value);
    },
    shuffle() {
      let random = () => Math.round(Math.random());
      this.pixels.columns.forEach(column => column.rows.forEach(pixel => {
        let value = random();
        pixel.update(value ? 2 : 0);
      }));
    },
    invert() {
      this.pixels.invert();
    }
  }

});
