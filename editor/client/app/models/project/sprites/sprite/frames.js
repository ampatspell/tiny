import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';
import { assign } from '@ember/polyfills';

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
  models: models('query.content').named('project/sprites/sprite/frames/frame').mapping((doc, sprite) => ({ sprite, doc })),

  ordered: computed('models.@each.index', function() {
    return this.models.sortBy('index');
  }).readOnly(),

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
    return this.models.findBy('id', doc.id);
  },

});
