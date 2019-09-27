import Component from '@ember/component';
import { or } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector' ],

  tab: 'selection',

  selection: or('project.selection', 'project'),

  actions: {
    tab(tab) {
      this.setProperties({ tab });
    }
  }

});
