import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-loops-list' ],

  state: null,
  sprite: readOnly('state.sprite'),
  loops: readOnly('sprite.loops'),
  selected: readOnly('state.loop'),

  actions: {
    select(loop) {
      this.state.selectLoop(loop);
      this.didSelect(loop);
    },
    create() {
      this.state.createLoop();
    }
  }

});
