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
  isCtrlPressed: false,
  isShiftPressed: false,
  isMetaPressed: false,

  shouldHandleEvent() {
    let el = document.activeElement;
    return el.tagName.toLowerCase() !== 'input';
  },

  updateCommonKeys(e) {
    this.setProperties({
      isAltPressed: e.altKey,
      isCtrlPressed: e.ctrlKey,
      isShiftPressed: e.shiftKey,
      isMetaPressed: e.metaKey
    });
  },

  onWindowKeyDown(e) {
    let { code } = e;

    if(this.shouldHandleEvent()) {

      if(code === 'Space') {
        this.setProperties({ isSpacePressed: true });
      }

      this.updateCommonKeys(e);
    }
  },

  onWindowKeyUp(e) {
    let { code, key } = e;

    if(code.startsWith('Digit') && this.shouldHandleEvent()) {
      let value = parseInt(key);
      this._invokeShortcut('onDigit', value);
    }

    if(code === 'Space') {
      this.setProperties({ isSpacePressed: false });
    }

    this.updateCommonKeys(e);

    if(this.shouldHandleEvent()) {
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
