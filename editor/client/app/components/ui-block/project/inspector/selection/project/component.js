import Component from '../-component';

export default Component.extend({

  actions: {
    createScene() {
      this.model.scenes.create({ identifier: 'new-scene' });
    },
    createSprite() {
      this.model.sprites.create({ identifier: 'new-sprite' });
    }
  }

});
