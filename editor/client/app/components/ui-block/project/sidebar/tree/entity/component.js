import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [
    ':ui-block-project-sidebar-tree-entity',
    'hidden:render-hidden',
    'model.hidden:hidden',
    'model.locked:locked',
    'model.selected:selected'
  ],

  expandable: readOnly('model.render.expandable'),
  hidden: readOnly('model.render.hidden'),
  locked: readOnly('model.render.locked'),
  expanded: readOnly('model.expanded'),
  reversed: readOnly('model.entities.reversed'),

  entities: computed('expandable', 'expanded', 'reversed', function() {
    if(!this.expandable) {
      return;
    }
    if(!this.expanded) {
      return;
    }
    return this.reversed;
  }).readOnly(),

  actions: {
    expanded() {
      this.toggle('expanded');
    },
    hidden() {
      this.toggle('hidden');
    },
    locked() {
      this.toggle('locked');
    }
  },

  toggle(key) {
    let { model } = this;
    let value = !model[key];
    model.update({ [key]: value });
  },

  click(e) {
    e.stopPropagation();
    this.project.select(this.model);
  }

});
