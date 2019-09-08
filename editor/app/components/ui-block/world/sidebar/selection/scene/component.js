import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-selection-scene' ],

  scene: readOnly('state.selection'),
  locked: readOnly('state.locked'),

  actions: {
    createLayer() {
      this.state.createLayer();
    },
    deleteScene() {
      this.state.deleteScene(this.scene);
    }
  }

});
