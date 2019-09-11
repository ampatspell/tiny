import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector-selection-layer' ],

  layer: readOnly('state.selection'),
  locked: readOnly('layer.chainLocked'),

  actions: {
    update(key, value) {
      this.layer.update({ [key]: value });
    },
    deleteLayer() {
      this.state.deleteLayer(this.layer);
    },
    createFillNode() {
      this.state.createFillNode();
    },
    createSpriteNode() {
      this.state.createSpriteNode();
    },
    moveUp() {
      this.layer.moveUp();
    },
    moveDown() {
      this.layer.moveDown();
    }
  }

});
