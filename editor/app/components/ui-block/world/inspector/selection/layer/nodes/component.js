import Component from '../-layer';

export default Component.extend({

  actions: {
    createFillNode() {
      this.state.createNode({
        type: 'fill',
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 8,
          height: 8
        },
        color: 'black'
      });
    },
    createSpriteNode() {
      this.state.createNode({
        type: 'sprite',
        position: {
          x: 0,
          y: 0,
        }
      });
    },
  }

});
