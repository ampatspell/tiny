import Component from '@ember/component';
import { className } from 'editor/utils/computed';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':ui-block-tree-row', '_level', 'isSelected:selected' ],

  _level: className({ key: 'level' }),

  isSelected: computed('selected', 'model', function() {
    let { selected, model } = this;
    return selected === model;
  }).readOnly(),

  actions: {
    select() {
      this.select(this.model);
    }
  }

});
