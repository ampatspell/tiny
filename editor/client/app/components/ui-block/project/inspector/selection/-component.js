import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: '',

  dialogs: service(),
  deleteConfirmation: null,

  actions: {
    locked(locked) {
      this.model.update({ locked });
    },
    update() {
      this.update(...arguments);
    },
    delete() {
      this.deleteModel();
    },
    moveUp() {
      this.model.moveUp();
    },
    moveDown() {
      this.model.moveDown();
    }
  },

  async deleteModel() {
    let message = this.deleteConfirmation;
    if(message) {
      let confirmed = await this.dialogs.alert(message, 'Cancel', 'Delete');
      if(!confirmed) {
        return;
      }
    }
    this.model.delete();
  },

  update(key, value) {
    this.model.update({ [key]: value });
  }

});
