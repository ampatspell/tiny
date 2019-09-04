import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-background-image' ],
  attributeBindings: [ 'style' ],

  url: null,
  size: null,

  style: computed('url', 'size', function() {
    let { url, size } = this;
    if(!url) {
      return;
    }
    let attrs = [ `background-image: url("${url}")` ];
    if(size) {
      let { width, height } = size;
      if(width) {
        attrs.push(`width: ${width}px;`);
      }
      if(height) {
        attrs.push(`height: ${height}px;`);
      }
    }
    return htmlSafe(attrs.join(';'));
  }).readOnly(),

});
