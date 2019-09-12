import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-tree-row',  'type', 'model.chainLocked:locked', 'model.chainHidden:hidden' ],

  type: computed('model.type', function() {
    let { model: { type } } = this;
    if(!type) {
      return;
    }
    return type.replace('/', '-');
  }).readOnly(),

  actions: {
    toggle() {
      this.model.update({ collapsed: !this.model.collapsed });
    },
    lock() {
      this.model.update({ locked: !this.model.locked });
    },
    hidden() {
      this.model.update({ hidden: !this.model.hidden });
    }
  }

});
