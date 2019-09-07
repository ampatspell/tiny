import Component from '@ember/component';
import KeyboardMixin from 'editor/utils/keyboard';

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-block-world-editor' ],

  state: null,
  stage: null,

  actions: {
    created(stage) {
      this.setProperties({ stage });
      this.state.onEditorCreated(this);
    },
    selectScene(scene) {
      this.state.selectScene(scene);
    }
  },

  center() {
    this.stage.center();
  }

});
