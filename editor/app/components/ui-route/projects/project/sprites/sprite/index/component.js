import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { delta, current } from 'editor/utils/computed';
import KeyboardMixin from 'editor/utils/keyboard';

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-route-projects-project-sprites-sprite-index' ],

  sprite: readOnly('model.sprite'),
  frames: readOnly('sprite.frames'),

  prev: delta('frames', 'frame', -1),
  next: delta('frames', 'frame', +1),

  frame: current('frames', 0),

  pixel: 16,

  actions: {
    frame(frame) {
      this.setProperties({ frame });
    },
    setPixel(frame, index, value) {
      frame.setPixel(index, value);
    },
    resize(handle, diff) {
      this.sprite.resize(handle, diff);
    },
    pixel(pixel) {
      this.setProperties({ pixel });
    },
    fill(value) {
      this.frame.fill(value);
    },
    invert() {
      this.frame.invert();
    }
  },

  onLeft() {
    let frame = this.prev;
    frame && this.setProperties({ frame });
  },

  onRight() {
    let frame = this.next;
    frame && this.setProperties({ frame });
  },

  onEscape() {
    this.router.transitionTo('projects.project');
  }

});
