import Component from '../../../../-component';

export default Component.extend({

  actions: {
    createFrame() {
      this.model.frames.create();
    },
  }

});