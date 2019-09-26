import Mixin from '@ember/object/mixin';
import { run } from '@ember/runloop';
import { computed } from '@ember/object';

export default Mixin.create({

  _windowKeyboardHandlers: computed(function() {
    let wrap = fn => e => run(() => fn.call(this, e));
    return {
      keydown: wrap(this.onWindowKeyDown),
      keyup:   wrap(this.onWindowKeyUp)
    };
  }).readOnly(),

  _withWindowKeyboardHandlers(cb) {
    let handlers = this._windowKeyboardHandlers;
    Object.keys(handlers).forEach(name => cb(window, name, handlers[name]));
  },

  didInsertElement() {
    this._super(...arguments);
    this._withWindowKeyboardHandlers((window, name, fn) => window.addEventListener(name, fn));
  },

  willDestroyElement() {
    this._super(...arguments);
    this._withWindowKeyboardHandlers((window, name, fn) => window.removeEventListener(name, fn));
  },

  _invokeShortcut(name, e) {
    this[name] && this[name].call(this, e);
  },

  isSpacePressed: false,
  isAltPressed: false,

  onWindowKeyDown(e) {
    let { code, key } = e;

    if(this.isBodyActive()) {

      if(code === 'Space') {
        this.setProperties({ isSpacePressed: true });
      }

      if(key === 'Alt') {
        this.setProperties({ isAltPressed: true });
      }

    }
  },

  isBodyActive() {
    return document.activeElement === document.body;
  },

  onWindowKeyUp(e) {
    let { code, key } = e;

    if(code.startsWith('Digit') && this.isBodyActive()) {
      let value = parseInt(key);
      this._invokeShortcut('onDigit', value);
    }

    if(code === 'Space') {
      this.setProperties({ isSpacePressed: false });
    }

    if(key === 'Alt') {
      this.setProperties({ isAltPressed: false });
    }

    if(this.isBodyActive()) {
      if(key === 'ArrowRight') {
        this._invokeShortcut('onRight');
      } else if(key === 'ArrowLeft') {
        this._invokeShortcut('onLeft');
      } else if(key === 'Escape') {
        this._invokeShortcut('onEscape');
      }
    }
  }

});
