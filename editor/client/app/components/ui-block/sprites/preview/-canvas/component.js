import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  tagName: 'canvas',
  classNameBindings: [ ':canvas', 'size::hidden' ],
  attributeBindings: [ 'style', 'width', 'height' ],

  width: readOnly('size.width'),
  height: readOnly('size.height'),

  style: computed('width', 'height', function() {
    let { width, height } = this;
    if(!width || !height) {
      return;
    }
    return htmlSafe(`width: ${width}px; height: ${height}px`);
  }).readOnly(),

});
