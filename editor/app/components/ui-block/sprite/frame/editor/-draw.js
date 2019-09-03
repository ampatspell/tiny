import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { run } from '@ember/runloop';

export default Mixin.create({

  isDrawing: null,

  _drawHandlers: computed(function() {
    let wrap = fn => e => run(() => fn.call(this, e));
    return {
      mousedown: wrap(this.onWindowMouseDown),
      mousemove: wrap(this.onWindowMouseMove),
      mouseup:   wrap(this.onWindowMouseUp)
    };
  }).readOnly(),

  didInsertElement() {
    this._super(...arguments);
    this._addDrawHandlers();
  },

  willDestroyElement() {
    this._super(...arguments);
    this._removeDrawHandlers();
  },

  _withDrawHandlers(cb) {
    let handlers = this._drawHandlers;
    Object.keys(handlers).forEach(name => cb(window, name, handlers[name]));
  },

  _addDrawHandlers() {
    this._withDrawHandlers((window, name, handler) => window.addEventListener(name, handler));
  },

  _removeDrawHandlers() {
    this._withDrawHandlers((window, name, handler) => window.removeEventListener(name, handler));
  },

  isChildElement(element) {
    let target = this.element;
    while(element) {
      if(target === element) {
        return true;
      }
      element = element.parentNode;
    }
  },

  onWindowMouseDown(e) {
    let pixel = this.pixelFromMouseEvent(e);
    if(!pixel) {
      return;
    }

    this.set('_drawing', this.onDrawStart(pixel, e));
  },

  onWindowMouseUp() {
    this.set('_drawing', null);
  },

  elementFromMouseEvent(e) {
    let { clientX, clientY } = e;
    return document.elementFromPoint(clientX, clientY);
  },

  pixelFromMouseEvent(e) {
    let el = this.elementFromMouseEvent(e);
    if(!this.isChildElement(el)) {
      return;
    }

    let { type, x, y } = el.dataset;

    if(type !== 'pixel') {
      return;
    }

    x = parseInt(x);
    y = parseInt(y);

    return this.frame.pixelAt(x, y);
  },

  onWindowMouseMove(e) {
    let drawing = this._drawing;
    if(!drawing) {
      return;
    }

    let pixel = this.pixelFromMouseEvent(e);
    if(!pixel) {
      return;
    }

    drawing(pixel);
  }

});
