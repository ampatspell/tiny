import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-world' ],

  state: null,
  world: readOnly('state.world'),
  locked: readOnly('world.locked'),

  actions: {
    update(key, value) {
      this.world.update({ [key]: value });
    },
    delete() {
      this.state.deleteWorld();
    }
  }

});
