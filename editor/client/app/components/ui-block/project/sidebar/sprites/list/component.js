import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':list', 'disabled:disabled' ],

  actions: {
    select(...args) {
      if(this.disabled) {
        return;
      }
      this.select(...args);
    }
  }

});
