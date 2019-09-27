import Component from '../../../-component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({

  frame: readOnly('model.sprite.frames.selected'),

  actions: {
    addFrame() {
      this.model.addFrame(this.frame);
    },
    removeFrame(idx) {
      this.model.removeFrameAtIndex(idx);
    }
  }

});
