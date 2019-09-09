import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar' ],

  tab: 'sprites',

  actions: {
    select(tab) {
      this.setProperties({ tab });
    }
  }

});
