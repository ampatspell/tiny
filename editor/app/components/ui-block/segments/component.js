import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-segments' ],

  actions: {
    select(choice) {
      this.select && this.select(choice);
    }
  }

});
