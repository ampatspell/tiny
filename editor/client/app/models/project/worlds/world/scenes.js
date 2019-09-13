import EmberObject, { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { array } from 'editor/utils/computed';

export default EmberObject.extend({

  world: null,

  ref: computed('world.doc.ref', function() {
    let { world: { doc: { ref } } } = this;
    return ref.collection('scenes');
  }).readOnly(),

  _adding: array(),

  query: observed().owner('ref').content(({ ref, _adding }) => {
    return ref.query({
      doc: path => _adding.findBy('path', path)
    });
  }),

  models: models('query.content').named('project/worlds/world/scenes/scene').mapping((doc, scenes) => ({ doc, scenes })),

  ordered: computed('models.@each.index', function() {
    return this.models.sortBy('index');
  }).readOnly(),

  reversed: computed('ordered', function() {
    return this.ordered.slice().reverse();
  }).readOnly(),

  //

  async load() {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load()));
  },

  //

  async create(opts) {
    let last = this.ordered.lastObject;
    let index = 0;
    if(last) {
      index = last.index + 1;
    }

    let {
      name,
      identifier,
      position,
      size,
      grid
    } = assign({
      name: null,
      identifier: null,
      position: { x: 4, y: 6 },
      size: { width: 128, height: 64 }
    }, opts);

    let doc = this.ref.doc().new({
      index,
      name,
      identifier,
      position,
      size,
      grid,
      background: 'white'
    });

    try {
      this._adding.pushObject(doc);
      await doc.save();
      return this.models.findBy('doc', doc);
    } finally {
      this._adding.removeObject(doc);
    }
  },

});
