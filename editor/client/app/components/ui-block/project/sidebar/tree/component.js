import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-sidebar-tree' ],

  click() {
    this.project.select(null);
  }

});
