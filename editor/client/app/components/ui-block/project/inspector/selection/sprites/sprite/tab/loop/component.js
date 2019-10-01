import Component from '../../../../-component';
import { readOnly } from '@ember/object/computed';
import { idsFromTarget } from 'editor/utils/dragula';

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
    reorder(el, target) {
      let frames = idsFromTarget(target);
      this.loop.update({ frames });
    }
  }

});
