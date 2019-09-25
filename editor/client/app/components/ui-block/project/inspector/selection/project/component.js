import Component from '../-component';

export default Component.extend({

  actions: {
    createScene() {
      this.model.scenes.create();
    },
    createSprite() {
      this.model.sprites.create();
    }
  }

});
