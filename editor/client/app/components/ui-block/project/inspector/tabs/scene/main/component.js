import Component from '../../-component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-tabs-scene-main' ],

  actions: {
    createGridLayer() {
      this.model.layers.createGridLayer();
    },
    createPixelLayer() {
      this.model.layers.createPixelLayer();
    }
  }

});
