import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-frames' ],
  attributeBindings: [ 'style' ],

  state: null,

  style: computed('state.sprite.size', function() {
    let { state: { sprite: { size } } } = this;
    return htmlSafe(`height: ${size.height * 2 + 30}px`);
  }).readOnly(),

  actions: {
    select(frame) {
      this.state.update({ frame });
    }
  }

});
