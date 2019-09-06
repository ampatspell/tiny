import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar' ],

  state: null,
  world: readOnly('state.world'),
  locked: readOnly('world.locked'),

  actions: {
    locked(locked) {
      this.world.update({ locked });
    },
  }

});
