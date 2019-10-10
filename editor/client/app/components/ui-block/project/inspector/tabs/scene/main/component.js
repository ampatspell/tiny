import Component from '../../-component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-tabs-scene-main' ],

  actions: {
    createGridLayer() {
      this.model.layers.create({ type: 'grid', grid: { width: 8, height: 8 } });
    },
    createPixelLayer() {
      this.model.layers.create({ type: 'pixel' });
    }
  }

});
