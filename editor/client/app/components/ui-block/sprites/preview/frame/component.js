import Component from '../-component';
import { readOnly } from '@ember/object/computed';
import { next, cancel } from '@ember/runloop';

export default Component.extend({
  classNameBindings: [ ':frame' ],

  frame: readOnly('model.previewRendered'),

  didInsertElement() {
    this._super(...arguments);
    this.addObserver('frame', this, this._frameDidChange, true);
    this.frameDidChange();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.removeObserver('frame', this, this._frameDidChange, true);
    cancel(this.__frameDidChange);
  },

  frameDidChange() {
    cancel(this.__frameDidChange);
    let { frame } = this;
    this.draw((ctx, { width, height }) => {
      if(!frame) {
        return false;
      }
      ctx.drawImage(frame, 0, 0, width, height);
    });
  },

  _frameDidChange() {
    cancel(this.__frameDidChange);
    this.__frameDidChange = next(() => this.frameDidChange());
  },

});
