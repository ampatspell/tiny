import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';
import { assign } from '@ember/polyfills';
import { delta, selectedWithDefault } from 'editor/utils/computed';

export default EmberObject.extend({

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

  selected: selectedWithDefault('ordered.firstObject'),
  previous: delta('ordered', 'selected', -1),
  next:     delta('ordered', 'selected', +1),

  select(selected) {
    selected = selected || null;
    this.setProperties({ selected });
  },

  selectPrevious() {
    let model = this.previous;
    model && this.select(model);
  },

  selectNext() {
    let model = this.next;
    model && this.select(model);
  },

  async load({ type }) {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load({ type })));
  },

  async create(opts) {
    let { index, bytes } = assign({ index: 0 }, opts);

    if(bytes) {
      bytes = bytes.slice();
    } else {
      let { size } = this;
      bytes = new Uint8Array(size.width * size.height);
    }

    let doc = this.ref.doc().new({
      index,
      bytes
    });

    await doc.save();
    let model = this.models.findBy('id', doc.id);
    this.select(model);
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

  async duplicate(frame) {
    let { index, bytes } = frame;
    index = index + 1;
    await this.reindex(index);
    let model = await this.create({ index, bytes });
    this.select(model);
    return model;
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

  //

  async onWillDeleteFrame(frame) {
    if(this.selected === frame) {
      this.selectPrevious();
      if(frame === frame) {
        this.select(null);
      }
    }
    await this.sprite.onWillDeleteFrame(frame);
  },

  async onDidDeleteFrame(frame) {
    await this.reindex();
    await this.sprite.onDidDeleteFrame(frame);
  },

});
