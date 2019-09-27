import Component from '../../../-component';

export default Component.extend({

  actions: {
    createLoop() {
      this.model.loops.create();
    },
    select() {
    }
  }

});
