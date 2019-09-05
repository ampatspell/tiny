import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-frame-preview' ],

  frame: null,
  scale: 2,

  preview: computed('frame.preview.{url,size}', 'scale', function() {
    let { scale, frame } = this;
    if(!frame) {
      return;
    }
    let { preview: { url, size: { width, height } } } = frame;
    let calc = value => value * scale;
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
