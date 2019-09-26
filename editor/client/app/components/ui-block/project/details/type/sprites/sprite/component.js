import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-details-type-sprites-sprite' ],

  actions: {
    select(frame) {
      this.model.frames.select(frame);
    }
  }

});
