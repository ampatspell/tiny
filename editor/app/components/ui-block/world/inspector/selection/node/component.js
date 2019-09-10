import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-selection-node' ],

  node: readOnly('state.selection'),
  locked: readOnly('node.chainLocked'),

  actions: {
    update(key, value) {
      this.node.update({ [key]: value });
    },
    deleteNode() {
      this.state.deleteNode(this.node);
    }
  }

});
