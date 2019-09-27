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
    // TODO: frame index
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
    return this.models.findBy('id', doc.id);
  },

  resize(batch, handle, target) {
    this.ordered.forEach(frame => {
      let doc = frame._resize(handle, target);
      batch.save(doc);
    });
  },

});
