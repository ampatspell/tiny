import Component from '../-component';
import { readOnly } from '@ember/object/computed';
import { next, cancel } from '@ember/runloop';

const keys = [ 'frame', 'pixel' ];

export default Component.extend({
  classNameBindings: [ ':frame' ],

  frame: readOnly('model.previewRendered'),

  _withKeys(cb) {
    keys.forEach(key => cb(key, this, this._propertiesDidChange, true));
  },

  didInsertElement() {
    this._super(...arguments);
    this._withKeys((...args) => this.addObserver(...args));
    this.drawFrame();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._withKeys((...args) => this.removeObserver(...args));
    this.cancelPropertiesDidChange();
  },

  cancelPropertiesDidChange() {
    cancel(this.__propertiesDidChange);
  },

  drawFrame() {
    this.cancelPropertiesDidChange();
    let { frame } = this;
    this.draw((ctx, { width, height }) => {
      if(!frame) {
        return false;
      }
      ctx.drawImage(frame, 0, 0, width, height);
    });
  },

  _propertiesDidChange() {
    this.cancelPropertiesDidChange();
    this.__propertiesDidChange = next(() => this.drawFrame());
  }

});
