import Component from '@ember/component';
import { computed }  from '@ember/object';

export default Component.extend({
  classNameBindings: [ ':item', 'isSelected:selected' ],

  isSelected: computed('model', 'selected', function() {
    let { model, selected } = this;
    return model === selected;
  }).readOnly(),

  click() {
    this.select();
  }

});
