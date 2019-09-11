import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-loops' ],

  actions: {
    createLoop() {
      this.state.createLoop();
    }
  }

});
