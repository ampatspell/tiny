import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-details-type-sprites-sprite-frames-frame', 'selected:selected' ],
  attributeBindings: [ 'style', 'index:data-id' ],

  sprite: readOnly('frame.sprite'),
  index: readOnly('frame.index'),

  style: computed('sprite.size', 'pixel', function() {
    let { sprite: { size }, pixel } = this;
    return htmlSafe(`height: ${size.height * pixel + 31}px`);
  }).readOnly(),

  click() {
    this.select();
  }

});
