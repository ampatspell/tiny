import Component from '@ember/component';
import DrawMixin from './-draw';
import { Pixel } from '../../../../models/pixels';
import { className } from '../../../../utils/computed';

export default Component.extend(DrawMixin, {
  classNameBindings: [ ':ui-block-pixels-editor', '_size' ],

  _size: className({ key: 'size', value: 'regular' }),

  pixels: null,

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
