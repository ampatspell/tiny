import Component from '../../../-component';

export default Component.extend({
  tagName: '',

  actions: {
    delete() {
      this.model.render.delete();
    }
  }

});
