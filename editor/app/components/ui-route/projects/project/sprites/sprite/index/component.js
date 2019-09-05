import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { delta, current } from 'editor/utils/computed';
import KeyboardMixin from 'editor/utils/keyboard';
import { model } from 'ember-cli-zuglet/lifecycle';

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-route-projects-project-sprites-sprite-index' ],

  sprite: readOnly('model.sprite'),

  state: model().owner('sprite').inline({

    frames: readOnly('sprite.frames'),

    prev: delta('frames', 'frame', -1),
    next: delta('frames', 'frame', +1),

    frame: current('frames', 0),

    pixel: 16,

    update(props) {
      this.setProperties(props);
    },

    onLeft() {
      let frame = this.prev;
      frame && this.update({ frame });
    },

    onRight() {
      let frame = this.next;
      frame && this.update({ frame });
    }

  }).mapping(({ sprite }) => ({ sprite })),

  actions: {
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
