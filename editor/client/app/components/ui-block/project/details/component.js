import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

const types = [
  'sprites/sprite'
];

export default Component.extend({
  classNameBindings: [ ':ui-block-project-details', 'hidden:hidden' ],

  selection: readOnly('project.selection'),

  hidden: computed('selection.typeGroup', function() {
    let { selection } = this;
    if(!selection) {
      return true;
    }
    if(!types.includes(selection.typeGroup)) {
      return true;
    }
    return false;
  }).readOnly()

});
