import Component from '../-component';

export default Component.extend({

  actions: {
    createSprite() {
      this.model.create();
    }
  }

});
