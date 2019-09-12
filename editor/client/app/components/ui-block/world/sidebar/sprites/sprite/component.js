import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':sprite', 'selected:selected' ],

  state: null,
  sprite: null,

  click(e) {
    e.stopPropagation();
    this.select();
  }

});
