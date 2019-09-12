import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-sprites' ],

  state: null,

  sprites: readOnly('state.sprites'),
  selected: readOnly('state.sprite'),

  actions: {
    select(sprite) {
      this.state.selectSprite(sprite);
    }
  },

  click() {
    this.state.selectSprite(null);
  }

});
