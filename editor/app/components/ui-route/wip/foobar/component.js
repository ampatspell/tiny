import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-foobar' ],

  sprite: computed(function() {
    let model = this.store.models.create('sprite', { path: 'sprites/one' });
    model.load();
    return model;
  }).readOnly(),

  frame: readOnly('sprite.frames.firstObject'),

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
