import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-tabs-sprite-loops' ],

  actions: {
    select(loop) {
      this.model.loops.select(loop);
      this.selectTab('loop');
    },
    createLoop() {
      this.model.loops.create();
    }
  }

});
