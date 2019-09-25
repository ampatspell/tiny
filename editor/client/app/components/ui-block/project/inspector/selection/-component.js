import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    locked(locked) {
      this.model.update({ locked });
    },
    update() {
      this.update(...arguments);
    },
    delete() {
      this.model.delete();
    },
    moveUp() {
      this.model.moveUp();
    },
    moveDown() {
      this.model.moveDown();
    }
  },

  update(key, value) {
    this.model.update({ [key]: value });

  }

});
