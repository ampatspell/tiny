import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-selection' ],

  project: null,
  selection: readOnly('project.selection'),

});
