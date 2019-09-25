import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';
import createSettingsMixin from '../../../-settings';

const SettingsMixin = createSettingsMixin('scene', 'layers');

export default EmberObject.extend(SettingsMixin, {

  typeName: 'Layers',

  scene: null,

  ref: computed('scene.ref', function() {
    let { scene: { ref } } = this;
    return ref.collection('layers');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),
  models: models('query.content').object('data.type').named(doc => {
    let type = doc.get('data.type');
    return `project/scenes/scene/layers/layer/type/${type}`;
  }).mapping((doc, layers) => ({ layers, doc })),

  ordered: computed('models.@each.index', function() {
    return this.models.sortBy('index');
  }).readOnly(),

  reversed: computed('ordered', function() {
    return this.ordered.slice().reverse();
  }).readOnly(),

  async load({ type }) {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load({ type })));
  },

  async create(opts) {
    let last = this.ordered.lastObject;
    let index = 0;
    if(last) {
      index = last.index + 1;
    }

    opts = assign({}, opts, { index });
    let doc = this.ref.doc().new(opts);

    await doc.save();
    return this.models.findBy('doc', doc);
  },

});
