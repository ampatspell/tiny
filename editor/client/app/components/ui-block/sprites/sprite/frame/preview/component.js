import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprites-sprite-frame-preview' ],

  frame: null,
  pixel: 2,

  preview: computed('frame.preview.{url,size}', 'pixel', function() {
    let { pixel, frame } = this;
    if(!frame) {
      return;
    }
    let { preview: { url, size: { width, height } } } = frame;
    let calc = value => value * pixel;
    let size = {
      width: calc(width),
      height: calc(height)
    };
    return {
      url,
      size
    };
  }).readOnly(),

});
