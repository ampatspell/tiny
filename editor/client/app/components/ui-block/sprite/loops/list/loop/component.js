import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':loop', 'selected:selected' ],

  state: null,
  loops: null,
  loop: null,

  frame: readOnly('state.frame'),

  actions: {
    update(key, value) {
      this.loop.update({ [key]: value });
    }
  },

  click() {
    this.select();
  }

});
