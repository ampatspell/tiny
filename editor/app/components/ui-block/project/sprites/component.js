import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-sprites' ],

  sprites: null,

  actions: {
    select(sprite) {
      this.select(sprite);
    }
  }

});
