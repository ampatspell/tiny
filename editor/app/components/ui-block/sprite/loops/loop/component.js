import Component from '@ember/component';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
  classNameBindings: [ ':loop' ],

  state: null,
  loops: null,
  loop: null,

  indexes: computed('loop.indexes.[]', function() {
    return A(this.loop.indexes).join(', ');
  }).readOnly(),

  actions: {
    toggle() {
      this.loop.update({ collapsed: !this.loop.collapsed });
    },
    updateIndexes(string) {
      let indexes = string.split(',').map(str => str.trim());
      this.loop.update({ indexes });
    },
    update(key, value) {
      this.loop.update({ [key]: value });
    }
  }

});
