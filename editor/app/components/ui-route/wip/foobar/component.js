import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { delta, current } from 'editor/utils/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-foobar' ],

  sprite: computed(function() {
    let doc = this.store.doc('sprites/one').existing();
    doc.load();
    let model = this.store.models.create('project/sprites/sprite', { doc });
    model.load();
    return model;
  }).readOnly(),

  frames: readOnly('sprite.frames'),

  prev: delta('frames', 'frame', -1),
  next: delta('frames', 'frame', +1),

  frame: current('frames', 0),

  didInsertElement() {
    this._super(...arguments);
    setGlobal({ component: this });
  },

  actions: {
    prev() {
      this.set('frame', this.prev);
    },
    next() {
      this.set('frame', this.next);
    },
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
