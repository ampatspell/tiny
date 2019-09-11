import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import KeyboardMixin from 'editor/utils/keyboard';
import { model } from 'ember-cli-zuglet/lifecycle';

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-route-projects-project-sprites-sprite-index' ],

  sprite: readOnly('model.sprite'),
  state: model().owner('sprite').named('state/sprite').mapping(({ sprite }) => ({ sprite })),

  actions: {
    created(editor) {
      this.state.onEditorCreated(editor);
    },
    setPixel(frame, index, value) {
      frame.setPixel(index, value);
    },
    resize(handle, diff) {
      this.sprite.resize(handle, diff);
    }
  },

  onLeft() {
    this.state.onLeft();
  },

  onRight() {
    this.state.onRight();
  },

  onEscape() {
    this.router.transitionTo('projects.project');
  }

});
