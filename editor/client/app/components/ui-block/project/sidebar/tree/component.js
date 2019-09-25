import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-sidebar-tree' ],

  actions: {
    select(model) {
      this.project.select(model);
    }
  },

  click() {
    this.project.select(null);
  }

});
