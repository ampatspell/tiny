import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import KeyboardMixin from 'editor/utils/keyboard';

const frame = key => readOnly(`frame.${key}`);

const position = { x: 15, y: 15 };

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-block-sprite-frame-editor' ],

  frame: null,
  pixel: null,

  size: frame('size'),
  bytes: frame('bytes'),

  position,

  actions: {
    created() {
    },
    update(index, value) {
      this.update(index, value);
    },
    resize(id, diff) {
      this.resize(id, diff);
      this.didResize(id, diff);
    }
  },

  didResize(id, diff) {
    let { position: { x, y }, pixel } = this;
    if(id === 'top') {
      y -= (diff.y * pixel);
    } else if(id === 'left') {
      x -= (diff.x * pixel);
    } else {
      return;
    }
    this.set('position', { x, y });
  }

});
