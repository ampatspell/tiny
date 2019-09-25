import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-projects-index' ],

  model: null,
  projects: readOnly('model.projects'),

  actions: {
    select({ id }) {
      this.router.transitionTo('projects.project', id);
    },
    new() {
      this.router.transitionTo('projects.new');
    }
  }

});
