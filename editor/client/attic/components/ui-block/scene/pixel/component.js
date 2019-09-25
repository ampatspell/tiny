import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-scene-pixel' ],

  pixel: null,

  actions: {
    update(pixel) {
      this.update(pixel);
    },
    center() {
      this.center();
    }
  }

});