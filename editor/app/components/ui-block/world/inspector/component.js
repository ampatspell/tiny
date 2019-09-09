import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-inspector' ],

  state: null,
  selected: 'selection',

  actions: {
    select(selected) {
      this.setProperties({ selected });
    },
    pixel(pixel) {
      this.state.update({ pixel });
    },
    center() {
      this.state.center();
    }
  }

});
