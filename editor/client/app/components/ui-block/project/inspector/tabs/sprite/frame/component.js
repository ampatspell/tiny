import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({

  frame: readOnly('model.frames.selected'),

  actions: {
    createFrame() {
      this.model.frames.createOrDuplicate(this.frame);
    },
    deleteFrame() {
      this.frame.delete();
    },
    fill(value) {
      this.frame.fill(value);
    },
    invert() {
      this.frame.invert();
    }
  }

});
