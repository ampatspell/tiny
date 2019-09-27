import Component from '../../-node';
import { computed } from '@ember/object';

export default Component.extend({

  loops: computed('node.loops.@each.identifier', function() {
    let { node: { loops } } = this;
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

  selected: computed('node.selected.identifier', 'loops.@each.identifier', function() {
    let { node: { selected } } = this;
    if(!selected) {
      return;
    }
    return this.loops.findBy('identifier', selected.identifier);
  }).readOnly(),

  actions: {
    loop({ identifier }) {
      this.update('loop', identifier);
    }
  }

});
