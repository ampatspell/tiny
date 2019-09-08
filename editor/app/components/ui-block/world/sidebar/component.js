import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar' ],

  state: null,
  selected: 'world',

  actions: {
    select(selected) {
      this.setProperties({ selected });
    },
    pixel(pixel) {
      this.state.update({ pixel });
    },
    center() {
      this.state.center();
    },
    // deleteScene(scene) {
    //   this.state.deleteScene(scene);
    // }
  }

});
