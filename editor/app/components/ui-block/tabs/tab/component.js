import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':tab', 'isSelected:selected' ],
  attributeBindings: [ 'role' ],

  role: 'button',

  isSelected: computed('id', 'selected', function() {
    let { id, selected } = this;
    return id === selected;
  }).readOnly(),

  click() {
    if(this.isSelected) {
      return;
    }
    this.select(this.id);
  }

});
