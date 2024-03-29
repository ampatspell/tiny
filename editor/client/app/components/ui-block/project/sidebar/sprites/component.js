import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';

const disabled = key => computed(`selection.{${key},_renderDisabled,scene.isEditing}`, function() {
  let { selection } = this;
  if(!selection) {
    return true;
  }
  if(!selection[key]) {
    return true;
  }
  if(selection._renderDisabled) {
    return true;
  }
  let { scene } = selection;
  if(!scene) {
    return true;
  }
  if(!scene.isEditing) {
    return true;
  }
  return false;
}).readOnly();

export default Component.extend({
  classNameBindings: [ ':ui-block-project-sidebar-sprites' ],

  selection: readOnly('project.selection.model'),
  sprite: null,

  framesDisabled: disabled('onFrame'),
  loopsDisabled: disabled('onLoop'),

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
    selection[name].call(selection, ...args);
  }

});
