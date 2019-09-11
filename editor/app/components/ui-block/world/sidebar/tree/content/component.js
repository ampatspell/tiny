import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-tree-row',  'model.type', 'model.chainLocked:locked', 'model.chainHidden:hidden' ],

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
