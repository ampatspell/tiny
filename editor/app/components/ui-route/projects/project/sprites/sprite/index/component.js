import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { delta, current } from 'editor/utils/computed';
import KeyboardMixin from 'editor/utils/keyboard';
import { model } from 'ember-cli-zuglet/lifecycle';
import alive from 'editor/utils/alive';
import { next } from '@ember/runloop';

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-route-projects-project-sprites-sprite-index' ],

  sprite: readOnly('model.sprite'),

  state: model().owner('sprite').inline({

    editor: null,

    frames: readOnly('sprite.frames'),

    prev: delta('frames', 'frame', -1),
    next: delta('frames', 'frame', +1),

    frame: current('frames', 0),

    pixel: 16,

    onEditorCreated(editor) {
      this.setProperties({ editor });
    },

    update: alive(function(props) {
      this.setProperties(props);
    }),

    center() {
      this.editor.center();
    },

    onLeft() {
      let frame = this.prev;
      frame && this.update({ frame });
    },

    onRight() {
      let frame = this.next;
      frame && this.update({ frame });
    },

    async duplicate() {
      let frame = await this.frame.duplicate();
      this.update({ frame });
    },

    async delete() {
      let { frame, prev } = this;
      this.update({ frame: prev });
      await frame.delete();
    }

  }).mapping(({ sprite }) => ({ sprite })),

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
