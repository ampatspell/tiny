import Component from '../-component';

export default Component.extend({

  actions: {
    createScene() {
      this.model.create();
    }
  }

});
