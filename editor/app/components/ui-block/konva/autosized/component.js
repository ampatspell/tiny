import Component from '@ember/component';
import { next, cancel } from '@ember/runloop';

const _window = () => {
  if(typeof window === 'undefined') {
    return;
  }
  return window; // eslint-ignore-line no-undef
}

const withWindow = cb => {
  let w = _window();
  if(!w) {
    return;
  }
  return cb(w);
}

export default Component.extend({
  classNameBindings: [ ':ui-block-konva-autosized' ],

  size: null,

  init() {
    this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);
    this.__onWindowResize = () => this._onWindowResize();
    withWindow(w => w.addEventListener('resize', this.__onWindowResize));
    this.onWindowResize();
  },

  willDestroyElement() {
    this._super(...arguments);
    withWindow(w => w.removeEventListener('resize', this.__onWindowResize));
  },

  onWindowResize() {
    let element = this.element;
    if(!element) {
      return;
    }

    let { width, height } = element.getBoundingClientRect();
    let size = this.size;

    if(size && size.width === width && size.height === height) {
      return;
    }

    this.set('size', { width, height });
  },

  _cancelOnWindowResize() {
    cancel(this.___onWindowResize);
  },

  _onWindowResize() {
    this._cancelOnWindowResize();
    this.___onWindowResize = next(() => this.onWindowResize());
  },

});
