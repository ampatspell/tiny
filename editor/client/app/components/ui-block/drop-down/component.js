import Component from '@ember/component';
import { A } from '@ember/array';

const all = A();

export default Component.extend({
  classNameBindings: [ ':ui-block-dropdown', 'disabled:disabled' ],

  expanded: false,

  didInsertElement() {
    this._super(...arguments);
    all.pushObject(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    all.removeObject(this);
  },

  actions: {
    toggle() {
      if(this.disabled) {
        return;
      }
      this.toggleProperty('expanded');
      this.update();
    },
    select(item) {
      if(!this.disabled) {
        if(this.selected !== item && this.select) {
          this.select(item);
        }
      }
      this.set('expanded', false);
      this.update();
    }
  },

  _close() {
    this.set('expanded', false);
  },

  update() {
    if(!this.expanded) {
      return;
    }
    all.forEach(component => component !== this && component._close());
  }

});
