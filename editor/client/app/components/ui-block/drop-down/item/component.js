import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-dropdown-item', 'selected:selected' ],

  click() {
    this.select();
  }

});
