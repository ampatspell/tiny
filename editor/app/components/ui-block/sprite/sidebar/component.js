import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-sidebar' ],

  state: null,
  sprite: readOnly('state.sprite'),
  frame: readOnly('state.frame'),

  actions: {
    pixel(pixel) {
      this.state.update({ pixel });
    },
    fill(value) {
      this.frame.fill(value);
    },
    invert() {
      this.frame.invert();
    }
  }

});
