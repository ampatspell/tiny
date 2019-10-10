import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';
import createSettingsMixin from '../../../-settings';
import MoveMixin from '../../../-move';

const SettingsMixin = createSettingsMixin('scene', 'layers');

export default EmberObject.extend(SettingsMixin, MoveMixin, {

  // typeName: 'Layers',

  // project: readOnly('scene.project'),

  // scene: null,

  // ref: computed('scene.ref', function() {
  //   let { scene: { ref } } = this;
  //   return ref.collection('layers');
  // }).readOnly(),

  // query: observed().owner('ref').content(({ ref }) => ref.query()),
  // models: models('query.content').object('data.type').named(doc => {
  //   let type = doc.get('data.type');
  //   return `project/scenes/scene/layers/layer/type/${type}`;
  // }).mapping((doc, layers) => ({ layers, doc })),

  // ordered: computed('models.@each.index', function() {
  //   return this.models.sortBy('index');
  // }).readOnly(),

  // visible: computed('ordered.@each.hidden', function() {
  //   return this.ordered.filter(model => !model.hidden);
  // }).readOnly(),

  // reversed: computed('ordered', function() {
  //   return this.ordered.slice().reverse();
  // }).readOnly(),

  // async load({ type }) {
  //   await resolveObservers(this.query);
  //   await all(this.models.map(model => model.load({ type })));
  // },

  async create(opts) {
    let last = this.ordered.lastObject;
    let index = 0;
    if(last) {
      index = last.index + 1;
    }

    opts = assign({}, opts, { index });
    let doc = this.ref.doc().new(opts);

    await doc.save();
    let model = this.models.findBy('id', doc.id);
    await this.scene.onDidCreateLayer(model);
    return model;
  },

  onParentResized(id, diff) {
    this.models.forEach(model => model.onParentResized(id, diff));
  },

  async onWillDeleteLayer(layer) {
    await this.project.onWillDeleteLayer(layer);
  },

  async onWillDeleteNode(node) {
    await this.project.onWillDeleteNode(node);
  },

  async onDidCreateNode(node) {
    await this.project.onDidCreateNode(node);
  },

});
