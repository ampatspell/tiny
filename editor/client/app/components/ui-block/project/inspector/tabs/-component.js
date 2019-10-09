import Component from '@ember/component';

export default Component.extend({

  actions: {
    update() {
      this.update(...arguments);
    },
  },

  update(key, value) {
    this.model.update({ [key]: value });
  }

});
