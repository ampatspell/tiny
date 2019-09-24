import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':lock' ],

  actions: {
    locked(value) {
      this.update && this.update(value);
    }
  }

});
