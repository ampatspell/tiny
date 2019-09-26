import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprites-sprite-frames' ],
  attributeBindings: [ 'style' ],

  sprite: null,
  pixel: 4,

  style: computed('sprite.size', 'pixel', function() {
    let { sprite: { size }, pixel } = this;
    return htmlSafe(`height: ${size.height * pixel + 31}px`);
  }).readOnly(),

  actions: {
    select(frame) {
      this.select(frame);
    }
  }

});
