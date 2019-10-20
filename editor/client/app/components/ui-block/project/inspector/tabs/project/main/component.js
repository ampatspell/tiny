import Component from '../../-component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-tabs-project-main' ],

  actions: {
    createScene() {
      this.model.scenes.create();
    },
    createSprite() {
      this.model.sprites.createFromTemplate();
    }
  }

});
