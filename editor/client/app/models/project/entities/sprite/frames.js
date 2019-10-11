import filteredEntities from '../../-filtered-entities';
import settings from '../../-settings';
import { computed } from '@ember/object';
import { delta } from 'editor/utils/computed';
import { assign } from '@ember/polyfills';
import { heart } from 'editor/utils/frame';

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

  //

  async didCreate() {
  },

  async create(opts) {
    let { index, bytes, identifier } = assign({ index: 0, identifier: null }, opts);

    if(bytes) {
      bytes = bytes.slice();
    } else {
      let { model: { size } } = this;
      bytes = new Uint8Array(size.width * size.height);
    }

    let model = await this.createModel({ type: 'sprite/frame', index, bytes, identifier });
    await this.didCreate(model);
    return model;
  },

  async createFromTemplate() {
    let bytes = new Uint8Array(heart);
    let frame = await this.create({ bytes, identifier: 'heart' });
    return frame;
  }

});
