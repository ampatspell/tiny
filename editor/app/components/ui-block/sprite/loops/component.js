import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-loops' ],

  state: null,
  sprite: readOnly('state.sprite'),
  loops: readOnly('sprite.loops'),

  actions: {
    createLoop() {
      this.state.createLoop();
    }
  }

});
