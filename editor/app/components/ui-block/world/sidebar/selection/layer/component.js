import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-selection-layer' ],

  layer: readOnly('state.selection'),
  locked: readOnly('state.locked'),

  actions: {
    deleteLayer() {
      this.state.deleteLayer(this.layer);
    }
  }

});
