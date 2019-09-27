import Component from '../../../../-component';
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
    update(key, value) {
      this.frame.update({ [key]: value });
    }
  }

});
