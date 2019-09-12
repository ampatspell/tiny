import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';

export default Component.extend({
  classNameBindings: [ ':loop' ],

  state: null,
  loops: null,
  loop: null,

  frame: readOnly('state.frame'),

  indexes: computed('loop.indexes.[]', function() {
    return A(this.loop.indexes).join(', ');
  }).readOnly(),

  actions: {
    toggle() {
      this.loop.update({ collapsed: !this.loop.collapsed });
    },
    updateIndexes(string) {
      let indexes = A(string.split(',').map(str => {
        let int = parseInt(str.trim());
        if(isNaN(int)) {
          return;
        }
        return int;
      })).compact();
      this.loop.update({ indexes });
    },
    update(key, value) {
      this.loop.update({ [key]: value });
    },
    addFrame() {
      this.loop.addFrame(this.frame);
    },
    removeFrame(loop, idx) {
      this.loop.removeFrameAtIndex(idx);
    },
    delete() {
      this.loop.delete();
    }
  }

});
