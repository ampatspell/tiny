import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

const types = [
  'sprites/sprite'
];

export default Component.extend({
  classNameBindings: [ ':ui-block-project-details', 'hidden:hidden' ],

  selection: readOnly('project.selection'),
  details: readOnly('selection.render.details'),

  hidden: computed('details.typeGroup', function() {
    let { details } = this;
    if(!details) {
      return true;
    }
    if(!types.includes(details.typeGroup)) {
      return true;
    }
    return false;
  }).readOnly()

});
