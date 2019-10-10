import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':loop', 'selected:selected' ],

  click() {
    this.select();
  }

});
