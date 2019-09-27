import Component from '@ember/component';
import randomString from 'ember-cli-zuglet/util/random-string';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-sidebar-project' ],

  actions: {
    generateToken() {
      this.project.update({ token: randomString(26) });
    },
    update(key, value) {
      this.project.update({ [key]: value });
    },
    delete() {
      this.project.delete();
      this.router.transitionTo('projects');
    }
  }

});
