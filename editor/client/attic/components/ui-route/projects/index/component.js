import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-projects-index' ],

  projects: readOnly('model.projects'),

  actions: {
    add() {
      this.router.transitionTo('projects.new');
    },
    select(project) {
      this.router.transitionTo('projects.project', project.id);
    }
  },

});
