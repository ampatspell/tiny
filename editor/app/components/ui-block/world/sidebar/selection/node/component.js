import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-selection-node' ],

  node: readOnly('state.selection'),
  locked: readOnly('state.locked'),

  actions: {
    deleteNode() {
      this.state.deleteNode(this.node);
    }
  }

});