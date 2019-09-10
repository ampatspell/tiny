import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-tree-row', 'model.locked:locked', 'model.hidden:hidden' ],

  actions: {
    lock() {
      this.model.update({ locked: !this.model.locked });
    },
    hidden() {
      this.model.update({ hidden: !this.model.hidden });
    }
  }

});
