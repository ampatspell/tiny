import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-sidebar-frame' ],

  state: null,
  sprite: readOnly('state.sprite'),
  frame: readOnly('state.frame'),
  locked: readOnly('sprite.locked'),

  actions: {
    locked(locked) {
      this.sprite.update({ locked });
    },
    fill(value) {
      this.frame.fill(value);
    },
    invert() {
      this.frame.invert();
    },
    create() {
      this.sprite.createFrame();
    },
    duplicate() {
      this.state.duplicate();
    },
    delete() {
      this.state.delete();
    }
  }

});