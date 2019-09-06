import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-editor' ],

  state: null,
  stage: null,

  actions: {
    created(stage) {
      this.setProperties({ stage });
      this.state.onEditorCreated(this);
    }
  },

  center() {
    this.stage.center();
  }

});
