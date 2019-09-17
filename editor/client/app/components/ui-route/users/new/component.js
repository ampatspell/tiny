import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-users-new' ],

  actions: {
    update(key, value) {
      this.model.set(key, value);
    },
    save() {
      this.model.save();
    }
  }

});
