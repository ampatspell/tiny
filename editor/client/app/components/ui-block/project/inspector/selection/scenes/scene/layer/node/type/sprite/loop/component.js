import Component from '../../../../../../../-component';
import { computed } from '@ember/object';

export default Component.extend({

  loops: computed('model.loops.@each.identifier', function() {
    let { model: { loops } } = this;
    if(!loops) {
      return;
    }
    return loops.map(frame => {
      let { identifier } = frame;
      let label = identifier;
      return {
        identifier,
        label
      };
    })
  }).readOnly(),

  loop: computed('model.loop', function() {
    let { model: { loop } } = this;
    if(!loop) {
      return;
    }
    return this.loops.findBy('identifier', loop.identifier);
  }).readOnly(),

  actions: {
    loop({ identifier }) {
      this.update('loop', identifier);
    }
  }

});
