import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-details-sprites-sprite-frames' ],
  attributeBindings: [ 'style' ],

  sprite: null,

  style: computed('sprite.size', 'pixel', function() {
    let { sprite: { size }, pixel } = this;
    return htmlSafe(`height: ${size.height * pixel + 31}px`);
  }).readOnly(),

  actions: {
    select(frame) {
      this.select(frame);
    },
    reorder(ids) {
      let indexes = ids.map(id => parseInt(id));
      this.sprite.frames.reorder(indexes);
    }
  }

});
