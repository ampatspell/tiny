import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';
import { assign } from '@ember/polyfills';
import { delta } from 'editor/utils/computed';
import { heart } from 'editor/utils/frame';
import SettingsMixin from './frames/-settings';

export default EmberObject.extend(SettingsMixin, {

  typeName: 'Frames',

  project: readOnly('sprite.project'),

  sprite: null,
  size: readOnly('sprite.size'),

  ref: computed('sprite.ref', function() {
    let { sprite: { ref } } = this;
    return ref.collection('frames');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),
  models: models('query.content').named('project/sprites/sprite/frames/frame').mapping((doc, frames) => ({ frames, doc })),

  ordered: computed('models.@each.index', function() {
    return this.models.sortBy('index');
  }).readOnly(),

  identified: computed('ordered.@each.identifier', function() {
    return this.ordered.filter(model => !!model.identifier);
  }).readOnly(),

  _framesPreviewRendered: computed('ordered.@each._previewRendered', function() {
    let { ordered } = this;
    if(!ordered) {
      return;
    }
    return ordered.map(frame => frame && frame._previewRendered);
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
    let index = this.ordered.indexOf(selected) || null;
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

  selectAnother(frame) {
    let previous = this.previous;
    if(previous === frame) {
      previous = null;
    }
    this.select(previous);
  },

  async load({ type }) {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load({ type })));
  },

  async didCreateFrame(frame) {
    this.select(frame);
  },

  async create(opts) {
    let { index, bytes, identifier } = assign({ index: 0, identifier: null }, opts);

    if(bytes) {
      bytes = bytes.slice();
    } else {
      let { size } = this;
      bytes = new Uint8Array(size.width * size.height);
    }

    let doc = this.ref.doc().new({
      index,
      bytes,
      identifier
    });

    await doc.save();
    let model = this.models.findBy('id', doc.id);
    await this.didCreateFrame(model);
    return model;
  },

  resize(batch, handle, target) {
    this.ordered.forEach(frame => {
      let doc = frame._resize(handle, target);
      batch.save(doc);
    });
  },

  async reindex(hole) {
    await this.store.batch(batch => {
      let delta = 0;
      this.ordered.forEach((frame, idx) => {
        let { doc } = frame;
        if(idx === hole) {
          delta = 1;
        }
        doc.set('data.index', idx + delta);
        batch.save(doc);
      });
    });
  },

  async reorder(indexes) {
    let { selected } = this;
    await this.store.batch(batch => {
      let frames = this.ordered.slice();
      frames.forEach(frame => {
        let { doc } = frame;
        doc.set('data.index', indexes.indexOf(frame.index));
        batch.save(doc);
      });
      this.select(selected);
    });
  },

  async duplicate(frame) {
    let { index, bytes } = frame;
    index = index + 1;
    await this.reindex(index);
    return await this.create({ index, bytes });
  },

  async createOrDuplicate(frame) {
    if(frame) {
      return await this.duplicate(frame);
    }
    return await this.create();
  },

  async createOrDuplicateSelected() {
    return await this.createOrDuplicate(this.selected);
  },

  async createFromTemplate() {
    let bytes = new Uint8Array(heart);
    let frame = await this.create({ bytes, identifier: 'heart' });
    return frame;
  },

  //

  async onWillDeleteFrame(frame) {
    if(this.selected === frame) {
      this.selectAnother(frame);
    }
    await this.sprite.onWillDeleteFrame(frame);
  },

  async onDidDeleteFrame(frame) {
    await this.reindex();
    await this.sprite.onDidDeleteFrame(frame);
  },

});
