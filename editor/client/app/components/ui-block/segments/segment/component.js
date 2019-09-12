import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':segment', 'isSelected:selected' ],
  attributeBindings: [ 'role' ],

  role: 'button',

  isSelected: computed('item', 'selected', function() {
    let { item, selected } = this;
    return item === selected;
  }).readOnly(),

  click() {
    if(this.isSelected) {
      return;
    }
    this.select();
  }

});
