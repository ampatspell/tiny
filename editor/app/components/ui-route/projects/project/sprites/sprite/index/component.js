import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { delta, current } from 'editor/utils/computed';
import KeyboardMixin from 'editor/utils/keyboard';

const sizes = [
  { label: 'Small', id: 'small', value: 4 },
  { label: 'Regular', id: 'regular', value: 8 },
  { label: 'Large', id: 'large', value: 16 }
];

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-route-projects-project-sprites-sprite-index' ],

  sprite: readOnly('model.sprite'),
  frames: readOnly('sprite.frames'),

  prev: delta('frames', 'frame', -1),
  next: delta('frames', 'frame', +1),

  frame: current('frames', 0),

  sizes,
  size: sizes[2],

  actions: {
    frame(frame) {
      this.setProperties({ frame });
    },
    update(pixel, value) {
      pixel.update(value);
    },
    size(size) {
      this.setProperties({ size });
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
