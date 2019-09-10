import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-world' ],

  state: null,
  world: readOnly('state.world'),
  locked: readOnly('world.locked'),

  actions: {
    delete() {
      this.state.deleteWorld();
    }
  }

});
