import Component from '../../-node';
import { computed } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({

  frames: computed('node.frames.@each.{index,identifier}', function() {
    let { node: { frames } } = this;
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

  selected: computed('node.selected', function() {
    let { node: { selected } } = this;
    if(!selected) {
      return;
    }
    return this.frames.findBy('identifier', selected.identifier);
  }).readOnly(),

  actions: {
    frame({ identifier }) {
      this.update('frame', identifier);
    }
  }

});
