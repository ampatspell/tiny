import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import alive from 'editor/utils/alive';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-loops-selected' ],

  state: null,
  frame: readOnly('state.frame'),
  loop: readOnly('state.loop'),

  actions: {
    update(key, value) {
      this.loop.update({ [key]: value });
    },
    delete() {
      this.delete();
    },
    addFrame() {
      this.loop.addFrame(this.frame);
    },
    removeFrame(idx) {
      this.loop.removeFrameAtIndex(idx);
    }
  },

  _didDelete: alive(function() {
    this.didDelete();
  }),

  async delete() {
    await this.state.deleteLoop(this.loop);
    this._didDelete();
  }

});
