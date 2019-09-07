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
    pixel(pixel) {
      this.state.update({ pixel });
    },
    center() {
      this.state.center();
    },
    selectScene(scene) {
      this.state.selectScene(scene);
    },
    createScene() {
      this.state.createScene({ name: 'New Scene', identifier: 'new-scene' });
    },
    deleteScene(scene) {
      this.state.deleteScene(scene);
    }
  }

});
