import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-tree' ],

  actions: {
    select(model) {
      this.select && this.select(model);
    }
  },

  click() {
    this.select && this.select(null);
  }

});
