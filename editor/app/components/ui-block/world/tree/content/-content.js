import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':content' ],

  click(e) {
    e.stopPropagation();
    this.select();
  }

});
