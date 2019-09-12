import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-segments', 'disabled:disabled' ],

  actions: {
    select(choice) {
      if(this.disabled) {
        return;
      }
      this.select && this.select(choice);
    }
  }

});
