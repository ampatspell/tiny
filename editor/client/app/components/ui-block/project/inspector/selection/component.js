import Component from '@ember/component';
import { or } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-selection' ],

  project: null,
  selection: or('project.selection', 'project'),

});
