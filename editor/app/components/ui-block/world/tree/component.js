import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-tree' ],

  actions: {
    select(selection) {
      this.state.select(selection);
    }
  }

});
