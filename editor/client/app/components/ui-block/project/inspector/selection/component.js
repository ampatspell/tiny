import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-selection', 'type' ],

  project: null,
  selection: null,

  type: computed('selection.typeGroup', function() {
    return this.selection.typeGroup.replace(/\//g, '-');
  }).readOnly(),

});
