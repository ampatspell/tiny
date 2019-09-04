import Component from '@ember/component';
import DrawMixin from './-draw';
import { Pixel } from 'editor/utils/pixel';
import { className } from 'editor/utils/computed';

export default Component.extend(DrawMixin, {
  classNameBindings: [ ':ui-block-sprite-frame-editor', '_size' ],

  _size: className({ key: 'size', value: 'regular' }),

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

  onDrawStart(pixel, e) {
    let value = this.targetValueFromEvent(pixel, e);
    this._update(pixel, value);
    return pixel => this._update(pixel, value);
  },

  _update(pixel, value) {
    this.update && this.update(pixel, value);
  }

});
