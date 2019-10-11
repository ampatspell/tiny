import Component from '../../../-component';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  tagName: '',

  dialogs: service(),
  deleteConfirmation: readOnly('model.render.deleteConfirmation'),

  actions: {
    delete() {
      this.deleteModel();
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
    // this.model.delete();
  }

});
