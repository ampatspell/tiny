import Component from '@ember/component';

export default Component.extend({
  tagName: '',

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
