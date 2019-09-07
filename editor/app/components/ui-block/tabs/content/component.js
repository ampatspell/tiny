import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  isSelected: computed('id', 'selected', function() {
    let { id, selected } = this;
    return id === selected;
  }).readOnly()

});
