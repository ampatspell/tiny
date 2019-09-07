import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':world' ],

  actions: {
    selectScene(scene) {
      this.state.selectScene(scene);
    },
    createScene() {
      this.state.createScene({ name: 'New Scene', identifier: 'new-scene' });
    },
    deleteScene(scene) {
      this.state.deleteScene(scene);
    }
  }

});
