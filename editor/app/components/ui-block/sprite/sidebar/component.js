import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-sidebar' ],
  attributeBindings: [ 'style' ],

  state: null,

  width: readOnly('state.sprite.size.width'),

  style: computed('width', function() {
    let { width } = this;
    width = Math.max(200, (width * 2) + 21);
    return htmlSafe(`width: ${width}px`);
  }).readOnly(),

  selected: 'frame',

  actions: {
    select(selected) {
      this.setProperties({ selected });
    },
    pixel(pixel) {
      this.state.update({ pixel });
    },
    center() {
      this.state.center();
    }
  }

});
