import Component from '../-component';
import { readOnly } from '@ember/object/computed';
import { next, cancel } from '@ember/runloop';

export default Component.extend({
  classNameBindings: [ ':frame' ],

  frame: readOnly('model.preview.rendered'),

  didInsertElement() {
    this._super(...arguments);
    this.addObserver('frame', this, this._frameDidChange);
    this._frameDidChange();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.removeObserver('frame', this, this._frameDidChange);
    cancel(this.__frameDidChange);
  },

  frameDidChange() {
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
