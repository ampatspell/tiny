import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-worlds' ],

  worlds: null,

  actions: {
    select(world) {
      this.select(world);
    }
  }

});
