import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':frame', 'selected:selected' ],

  click() {
    this.select();
  }

});
