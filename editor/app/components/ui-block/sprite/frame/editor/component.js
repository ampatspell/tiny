import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import KeyboardMixin from 'editor/utils/keyboard';

const frame = key => readOnly(`frame.${key}`);

export default Component.extend(KeyboardMixin, {
  classNameBindings: [ ':ui-block-sprite-frame-editor' ],

  frame: null,
  pixel: null,

  size: frame('size'),
  bytes: frame('bytes'),

  stage: null,

  actions: {
    created(stage) {
      this.setProperties({ stage });
      this.created && this.created(this);
    },
    update(index, value) {
      this.update(index, value);
    },
    resize(id, diff) {
      this.resize(id, diff);
      this.didResize(id, diff);
    },
    move(opts) {
      console.log('begin', opts);
      return target => {
        console.log('move', target);
      }
    }
  },

  center() {
    this.stage.center();
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
