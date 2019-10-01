import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { indexesFromDropEvent } from 'editor/utils/dragula';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-details-type-sprites-sprite-frames' ],
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
    reorder(...args) {
      let indexes = indexesFromDropEvent(...args);
      this.sprite.frames.reorder(indexes);
    }
  }

});
