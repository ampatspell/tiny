import filteredEntities from '../../-filtered-entities';
import settings from '../../-settings';
import { computed } from '@ember/object';
import { delta } from 'editor/utils/computed';

const Frames = filteredEntities('sprite/frame');
const SettingsMixin = settings('model', 'frames');

export default Frames.extend(SettingsMixin, {

  model: null,

  previewRendered: computed('ordered.@each.previewRendered', function() {
    let { ordered } = this;
    if(!ordered) {
      return;
    }
    return ordered.map(frame => frame && frame.previewRendered);
  }).readOnly(),

  index: computed('settings.index', function() {
    let { settings } = this;
    let index = 0;
    if(settings && settings.index) {
      index = settings.index;
    }
    return index;
  }),

  selected: computed('index', 'ordered.[]', function() {
    let { index, ordered } = this;
    return ordered.objectAt(index);
  }),

  previous: delta('ordered', 'selected', -1),
  next:     delta('ordered', 'selected', +1),

  select(selected) {
    let index = this.ordered.indexOf(selected);
    if(index === -1) {
      index = null;
    }
    this.update({ index });
  },

  selectPrevious() {
    let model = this.previous;
    model && this.select(model);
  },

  selectNext() {
    let model = this.next;
    model && this.select(model);
  },

  reorder(indexes) {
    let { selected } = this;
    let frames = this.ordered.slice();
    frames.forEach(frame => {
      let index = indexes.indexOf(frame.index);
      frame.update({ index });
    });
    this.select(selected);
  },

});
