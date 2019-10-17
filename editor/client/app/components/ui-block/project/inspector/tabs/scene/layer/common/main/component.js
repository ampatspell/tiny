import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    createFillNode() {
      this.model.nodes.createFillNode();
    },
    createSpriteFrameNode() {
      this.model.nodes.createSpriteFrameNode();
    },
    createSpriteLoopNode() {
      this.model.nodes.createSpriteLoopNode();
    }
  }

});
