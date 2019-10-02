import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-project-sidebar-sprites' ],

  selection: readOnly('project.selection'),
  sprite: null,

  actions: {
    selectSprite(sprite) {
      if(this.sprite === sprite) {
        sprite = null;
      }
      this.set('sprite', sprite);
    },
    selectLoop(loop) {
      this.call('onLoop', loop);
    },
    selectFrame(frame) {
      this.call('onFrame', frame);
    }
  },

  call(name, ...args) {
    let { selection } = this;
    if(!selection) {
      return;
    }
    let fn = selection[name];
    if(!fn) {
      return;
    }
    fn.call(selection, ...args);
  }

});
