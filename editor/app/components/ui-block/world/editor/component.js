import Component from '@ember/component';
import { computed } from '@ember/object';
import KeyboardMixin from 'editor/utils/keyboard';

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-block-world-editor' ],

  state: null,
  stage: null,

  selectedScene: computed('state.selection', function() {
    let { state: { selection } } = this;
    if(!selection) {
      return;
    }
    if(selection.isScene) {
      return selection;
    }
    return selection.scene;
  }).readOnly(),

  actions: {
    created(stage) {
      this.setProperties({ stage });
      this.state.onEditorCreated(this);
    },
    select(model) {
      this.state.select(model);
    },
    onStageClick() {
      this.state.select(null);
    }
  },

  center() {
    this.stage.center();
  }

});
