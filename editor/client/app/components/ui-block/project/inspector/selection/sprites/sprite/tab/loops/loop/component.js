import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':loop' ],

  click() {
    this.select();
  }

});