import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-foobar' ],

  frame: computed(function() {
    let model = this.store.models.create('sprite/frame', { path: 'pixels/one' });
    model.load();
    return model;
  }).readOnly(),

  actions: {
    size(size) {
      this.setProperties({ size });
    },
    update(pixel, value) {
      pixel.update(value);
    },
    fill(value) {
      this.frame.fill(value);
    },
    shuffle() {
      let random = () => Math.round(Math.random());
      this.frame.columns.forEach(column => column.rows.forEach(pixel => {
        let value = random();
        pixel.update(value ? 2 : 0);
      }));
    },
    invert() {
      this.frame.invert();
    }
  }

});
