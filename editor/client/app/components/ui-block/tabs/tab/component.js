import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':tab', 'isSelected:selected' ],
  attributeBindings: [ 'role' ],

  role: 'button',

  isSelected: computed('key', 'selected', function() {
    let { key, selected } = this;
    return key === selected;
  }).readOnly(),

  click() {
    if(this.isSelected) {
      return;
    }
    this.select(this.key);
  }

});
