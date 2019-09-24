import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':dropdown' ],

  actions: {
    select(item) {
      this.update(item);
    }
  }

});
