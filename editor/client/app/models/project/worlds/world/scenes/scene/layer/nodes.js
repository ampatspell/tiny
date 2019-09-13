import EmberObject, { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { array } from 'editor/utils/computed';

export default EmberObject.extend({

  layer: null,

  ref: computed('layer.ref', function() {
    let { layer: { ref } } = this;
    return ref.collection('nodes');
  }).readOnly(),

  _adding: array(),

  query: observed().owner('ref').content(({ ref, _adding }) => {
    return ref.query({
      doc: path => _adding.findBy('path', path)
    });
  }),

  models: models('query.content')
    .object('data.type')
    .named(doc => {
      let type = doc.get('data.type');
      return `project/worlds/world/scenes/scene/layer/node/type/${type}`;
    })
    .mapping((doc, nodes) => ({ doc, nodes })),

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

    opts = assign({}, opts, { index });
    let doc = this.ref.doc().new(opts);

    try {
      this._adding.pushObject(doc);
      await doc.save();
      return this.models.findBy('doc', doc);
    } finally {
      this._adding.removeObject(doc);
    }
  },

  //

  async _moveDelta(node, delta) {
    let { ordered } = this;
    let idx = ordered.indexOf(node);
    if(idx === -1) {
      return;
    }

    idx = idx + delta;
    if(idx < 0 || idx > ordered.length - 1) {
      return;
    }

    let next = ordered.objectAt(idx);
    if(!next) {
      return;
    }

    let { index } = node;

    node.doc.data.setProperties({ index: next.index });
    next.doc.data.setProperties({ index });

    await this.store.batch(batch => {
      batch.save(node.doc);
      batch.save(next.doc);
    });
  },

  async moveUp(node) {
    await this._moveDelta(node, +1);
  },

  async moveDown(node) {
    await this._moveDelta(node, -1);
  },

});
