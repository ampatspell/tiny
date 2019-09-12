import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-inspector-sprite' ],

  state: null,
  sprite: readOnly('state.sprite'),
  locked: readOnly('sprite.locked'),

  actions: {
    update(key, value) {
      this.sprite.update({ [key]: value });
    },
    delete() {
      this.state.deleteSprite();
    }
  }

});
