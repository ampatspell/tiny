import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: '',

  isSelected: computed('key', 'selected', function() {
    let { key, selected } = this;
    return key === selected;
  }).readOnly()

});
