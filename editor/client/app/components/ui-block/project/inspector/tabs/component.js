import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-tabs' ],

  model: readOnly('project.selection.model'),
  definitions: readOnly('model.render.inspectorTabs'),

  tab: computed('definitions.@each.id', {
    get() {
      let value = this._tab;
      let tabs = this.definitions;
      if(tabs && !tabs.findBy('id', value)) {
        value = tabs.firstObject.id;
      }
      return value;
    },
    set(key, value) {
      this._tab = value;
      return value;
    }
  }),

  actions: {
    tab(tab) {
      this.setProperties({ tab });
    }
  }

});
