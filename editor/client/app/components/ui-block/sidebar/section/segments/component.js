import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':segments' ],

  actions: {
    select(item) {
      this.update(item);
    }
  }

});
