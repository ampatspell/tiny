import Component from '../../-node';
import { computed } from '@ember/object';

export default Component.extend({

  frames: computed('node.frames.@each.index', function() {
    let { node: { frames } } = this;
    if(!frames) {
      return;
    }
    return frames.map(frame => {
      let { index } = frame;
      let label = `#${index}`;
      return {
        index,
        label
      };
    })
  }).readOnly(),

  selected: computed('node.selected', function() {
    let { node: { selected } } = this;
    if(!selected) {
      return;
    }
    return this.frames.findBy('index', selected.index);
  }).readOnly(),

  actions: {
    frame({ index }) {
      this.update('frame', index);
    }
  }

});
