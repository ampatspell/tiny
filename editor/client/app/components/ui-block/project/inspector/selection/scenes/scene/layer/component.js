import Component from '../../../-component';

export default Component.extend({

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
