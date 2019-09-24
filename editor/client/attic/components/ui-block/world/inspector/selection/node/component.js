import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-selection-node', 'type' ],

  node: readOnly('state.selection'),
  locked: readOnly('node.chainLocked'),

  type: computed('node.type', function() {
    return this.node.type.replace('/', '-');
  }).readOnly(),

  actions: {
    update(key, value) {
      this.node.update({ [key]: value });
    },
    deleteNode() {
      this.state.deleteNode(this.node);
    },
    moveUp() {
      this.node.moveUp();
    },
    moveDown() {
      this.node.moveDown();
    }
  }

});
