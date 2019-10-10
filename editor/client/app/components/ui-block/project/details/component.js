import Component from '@ember/component';
import { readOnly, not } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-details', 'hidden:hidden' ],

  details: readOnly('project.selection.model'),
  componentName: readOnly('details.render.detailsComponentName'),

  hidden: not('componentName'),

});
