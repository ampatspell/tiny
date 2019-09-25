import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  actions: {
    locked(locked) {
      this.model.update({ locked });
    },
    update(key, value) {
      this.model.update({ [key]: value });
    }
  }

});
