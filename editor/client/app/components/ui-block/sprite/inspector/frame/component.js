import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-inspector-frame' ],

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
      this.state.duplicateCurrentFrame();
    },
    delete() {
      this.state.deleteCurrentFrame();
    },
    update(key, value) {
      this.frame.update({ [key]: value });
    }
  }

});
