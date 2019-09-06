import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-editor' ],

  actions: {
    created(stage) {
      this.created && this.created(stage);
    }
  }

});
