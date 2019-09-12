import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-loops' ],
  attributeBindings: [ 'style' ],

  state: null,
  sprite: readOnly('state.sprite'),
  loops: readOnly('sprite.loops'),

  width: readOnly('sprite.size.width'),

  style: computed('width', function() {
    let { width } = this;
    width = Math.max(220, (width * 2) + 31);
    return htmlSafe(`width: ${width}px`);
  }).readOnly(),

  actions: {
    createLoop() {
      this.state.createLoop();
    }
  }

});
