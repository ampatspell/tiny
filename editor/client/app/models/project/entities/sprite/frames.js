import filteredEntities from '../../-filtered-entities';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

const Frames = filteredEntities('sprite/frame');

export default Frames.extend({

  model: null,

  previewRendered: computed('ordered.@each.previewRendered', function() {
    let { ordered } = this;
    if(!ordered) {
      return;
    }
    return ordered.map(frame => frame && frame.previewRendered);
  }).readOnly(),

  selected: readOnly('ordered.firstObject'),

});
