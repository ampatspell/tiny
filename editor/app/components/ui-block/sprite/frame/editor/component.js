import Component from '@ember/component';
import DrawMixin from './-draw';
import { Pixel } from 'editor/utils/pixel';
import { className } from 'editor/utils/computed';
import { next, cancel } from '@ember/runloop';
import alive from 'editor/utils/alive';

export default Component.extend(DrawMixin, {
  classNameBindings: [ ':ui-block-sprite-frame-editor', '_size' ],

  _size: className({ key: 'size', value: 'regular' }),

  isReady: false,
  frame: null,

  targetValueFromEvent(pixel, e) {
    let { shiftKey, metaKey } = e;
    if(shiftKey) {
      return Pixel.transparent;
    } else if(metaKey) {
      return Pixel.white;
    } else {
      return Pixel.black;
    }
  },

  setReady: alive(function(isReady) {
    this.setProperties({ isReady });
  }),

  didReceiveAttrs() {
    this.setReady(false);
    cancel(this._ready);
    this._ready = next(() => this.setReady(true));
  },

  onDrawStart(pixel, e) {
    let value = this.targetValueFromEvent(pixel, e);
    this._update(pixel, value);
    return pixel => this._update(pixel, value);
  },

  _update(pixel, value) {
    this.update && this.update(pixel, value);
  }

});
