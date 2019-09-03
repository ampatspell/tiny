import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-pixels-editor' ],

  pixels: null,

  actions: {
    click(pixel, e) {
      let { shiftKey: shift, metaKey: meta } = e;
      this.update && this.update(pixel, { shift, meta });
    }
  }

});
