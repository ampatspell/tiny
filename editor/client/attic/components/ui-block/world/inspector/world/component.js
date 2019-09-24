import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import randomString from 'ember-cli-zuglet/util/random-string';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-world' ],

  state: null,
  world: readOnly('state.world'),
  locked: readOnly('world.locked'),

  actions: {
    update(key, value) {
      this.world.update({ [key]: value });
    },
    generateToken() {
      this.world.update({ token: randomString(24) });
    },
    delete() {
      this.state.deleteWorld();
    }
  }

});
