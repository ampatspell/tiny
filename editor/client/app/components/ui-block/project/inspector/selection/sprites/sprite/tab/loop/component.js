import Component from '../../../../-component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({

  loop: readOnly('model.loops.selected'),
  frame: readOnly('model.frames.selected'),

  actions: {
    addFrame() {
      this.loop.addFrame(this.frame);
    },
    removeFrame(idx) {
      this.loop.removeFrameAtIndex(idx);
    },
    update(key, value) {
      this.loop.update({ [key]: value });
    },
    deleteLoop() {
      this.loop.delete();
      this.tab('loops');
    },
    reorder(frames) {
      this.loop.update({ frames });
    }
  }

});
