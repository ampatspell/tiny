import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-sidebar-sprites' ],

  selected: null,

  actions: {
    selectSprite(sprite) {
      if(this.selected === sprite) {
        sprite = null;
      }
      this.set('selected', sprite);
    }
  }

});
