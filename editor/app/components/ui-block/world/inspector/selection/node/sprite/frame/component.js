import Component from '../../-node';

export default Component.extend({

  actions: {
    frame(value) {
      value = parseInt(value);
      if(isNaN(value)) {
        return;
      }
      this.update('frame', value);
    }
  }

});
