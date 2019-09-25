import Component from '../../../../../../../-component';
import { computed } from '@ember/object';

export default Component.extend({

  loops: computed('model.spriteLoops.@each.identifier', function() {
    let { model: { spriteLoops } } = this;
    if(!spriteLoops) {
      return;
    }
    return spriteLoops.map(loop => {
      let { identifier } = loop;
      let label = identifier;
      return {
        identifier,
        label
      };
    })
  }).readOnly(),

  loop: computed('loops.@each.identifier', 'model.spriteLoop', function() {
    let { model: { spriteLoop } } = this;
    if(!spriteLoop) {
      return;
    }
    return this.loops.findBy('identifier', spriteLoop.identifier);
  }).readOnly(),

  actions: {
    loop({ identifier }) {
      this.update('loop', identifier);
    }
  }

});
