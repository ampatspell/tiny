import Component from '../../../../../../../-component';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({

  frames: computed('model.frames.@each.{index,identifier}', function() {
    let { model: { frames } } = this;
    if(!frames) {
      return;
    }
    return A(frames.map(frame => {
      let { index, identifier } = frame;
      if(!identifier) {
        return;
      }
      let label = `${identifier} (#${index})`;
      return {
        identifier,
        label
      };
    })).compact();
  }).readOnly(),

  frame: computed('model.frame', function() {
    let { model: { frame } } = this;
    if(!frame) {
      return;
    }
    return this.frames.findBy('identifier', frame.identifier);
  }).readOnly(),

  actions: {
    frame({ identifier }) {
      this.update('frame', identifier);
    }
  }

});
