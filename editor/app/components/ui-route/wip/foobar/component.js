import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { delta } from 'editor/utils/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-foobar' ],

  sprite: computed(function() {
    let model = this.store.models.create('sprite', { path: 'sprites/one' });
    model.load();
    return model;
  }).readOnly(),

  frames: readOnly('sprite.frames'),

  prev: delta('frames', 'frame', -1),
  next: delta('frames', 'frame', +1),

  index: 0,

  frame: computed('index', 'frames.[]', function() {
    return this.frames.objectAt(this.index);
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);
    setGlobal({ component: this });
  },

  actions: {
    prev() {
      let next = this.prev;
      if(!next) {
        return;
      }
      this.set('index', this.frames.indexOf(next));
    },
    next() {
      let next = this.next;
      if(!next) {
        return;
      }
      this.set('index', this.frames.indexOf(next));
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
