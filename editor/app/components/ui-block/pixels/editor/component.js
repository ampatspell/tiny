import Component from '@ember/component';
import DrawMixin from './-draw';
import { Pixel } from '../../../../models/pixels';

export default Component.extend(DrawMixin, {
  classNameBindings: [ ':ui-block-pixels-editor' ],

  pixels: null,

  actions: {
    click(pixel, e) {
      this._update(pixel, this.targetValueFromEvent(pixel, e));
    }
  },

  targetValueFromEvent(pixel, e) {
    let { shiftKey: shift } = e;
    if(shift) {
      return Pixel.transparent;
    } else {
      if(pixel.value === Pixel.black) {
        return Pixel.white;
      } else {
        return Pixel.black;
      }
    }
  },

  onDrawStart(pixel, e) {
    let value = this.targetValueFromEvent(pixel, e);
    return pixel => this._update(pixel, value);
  },

  _update(pixel, value) {
    this.update && this.update(pixel, value);
  }

});
