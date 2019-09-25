import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-sidebar' ],

  tab: 'tree',

  actions: {
    tab(tab) {
      this.setProperties({ tab });
    }
  }

});
