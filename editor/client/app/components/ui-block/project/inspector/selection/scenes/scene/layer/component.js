import Component from '../../../-component';

export default Component.extend({

  deleteConfirmation: 'Sure you want to delete this layer?',

  actions: {
    createFillNode() {
      this.model.nodes.createFill();
    },
    createSpriteFrameNode() {
      this.model.nodes.createSpriteFrame();
    },
    createSpriteLoopNode() {
      this.model.nodes.createSpriteLoop();
    }
  }

});
