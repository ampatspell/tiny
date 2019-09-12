import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-selection-world' ],

  world: readOnly('state.world'),
  locked: readOnly('world.locked'),

  actions: {
    locked(locked) {
      this.world.update({ locked });
    },
    createScene() {
      this.state.createScene({ name: 'New Scene', identifier: 'new-scene' });
    }
  }

});
