import Component from '@ember/component';
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
    deleteLoop() {
      this.loop.delete();
      this.selectTab('loops');
    },
    reorder(frames) {
      this.loop.update({ frames });
    }
  }

});
