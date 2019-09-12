import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-loops' ],
  attributeBindings: [ 'style' ],

  tab: 'list',

  state: null,
  sprite: readOnly('state.sprite'),
  loops: readOnly('sprite.loops'),
  width: readOnly('sprite.size.width'),

  style: computed('width', function() {
    let { width } = this;
    width = Math.max(200, (width * 2) + 31);
    return htmlSafe(`width: ${width}px`);
  }).readOnly(),

  actions: {
    tab(tab) {
      this.setProperties({ tab });
    }
  }

});
