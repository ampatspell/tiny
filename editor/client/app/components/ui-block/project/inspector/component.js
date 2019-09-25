import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector' ],

  tab: 'selection',

  actions: {
    tab(tab) {
      this.setProperties({ tab });
    }
  }

});
