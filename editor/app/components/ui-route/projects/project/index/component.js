import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-projects-project-index' ],

  project: readOnly('model.project'),

});
