import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-inspector-tabs-sprite-loop-frame' ],
  attributeBindings: [ 'frame.id:data-id' ],

  actions: {
    remove() {
      if(this.disabled) {
        return;
      }
      this.remove();
    }
  }

});
