import Component from '../../../-component';

export default Component.extend({
  tagName: '',

  actions: {
    moveUp() {
      this.model.moveUp();
    },
    moveDown() {
      this.model.moveDown();
    }
  }

});
