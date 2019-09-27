import Component from '@ember/component';
import { computed } from '@ember/object';
import { or } from '@ember/object/computed';

const mapping = {
  'sprites/sprite': [
    { id: 'frame', label: 'Frame', component: 'sprites/sprite/tab/frame' },
    { id: 'loops', label: 'Loops', component: 'sprites/sprite/tab/loops' },
    { id: 'loop',  label: 'Loop',  component: 'sprites/sprite/tab/loop' }
  ]
};

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector' ],

  tab: computed('inspectors', {
    get() {
      let value = this._tab;
      if(!value || !this.inspectors.findBy('id', value)) {
        value = 'selection';
        this._tab = value;
      }
      return value;
    },
    set(key, value) {
      this._tab = value;
      return value;
    }
  }),

  selection: or('project.selection', 'project'),

  inspectors: computed('selection.typeGroup', function() {
    let { selection: { typeGroup } } = this;
    return mapping[typeGroup] || [];
  }).readOnly(),

  actions: {
    tab(tab) {
      this.setProperties({ tab });
    }
  }

});
