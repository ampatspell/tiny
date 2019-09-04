import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';

export default Mixin.create({

  didInsertElement() {
    this._super(...arguments);
    this._keyboardHandler = e => run(() => this._onShortcut(e));
    window.addEventListener('keyup', this._keyboardHandler);
  },

  willDestroyElement() {
    this._super(...arguments);
    window.removeEventListener('keyup', this._keyboardHandler);
  },

  _invokeShortcut(name, e) {
    this[name] && this[name].call(this, e);
  },

  _onShortcut(e) {
    let { key } = e;
    if(key === 'ArrowRight') {
      this._invokeShortcut('onRight');
    } else if(key === 'ArrowLeft') {
      this._invokeShortcut('onLeft');
    } else if(key === 'Escape') {
      this._invokeShortcut('onEscape');
    }
  }

});
