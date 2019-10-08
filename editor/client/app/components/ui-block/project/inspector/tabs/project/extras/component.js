import Component from '@ember/component';
import randomString from 'ember-cli-zuglet/util/random-string';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-tabs-project-extras' ],

  dialogs: service(),

  actions: {
    generateToken() {
      this.model.update({ token: randomString(26) });
    },
    update(key, value) {
      this.model.update({ [key]: value });
    },
    async delete() {
      let confirmed = await this.dialogs.alert('Are you sure you want to delete this project?', 'Cancel', 'Delete');
      if(!confirmed) {
        return;
      }
      this.model.delete();
      this.router.transitionTo('projects');
    }
  }

});
