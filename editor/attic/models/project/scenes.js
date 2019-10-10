import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import createSettingsMixin from '../-settings';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';
import MoveMixin from '../-move';

const SettingsMixin = createSettingsMixin('project', 'scenes');

export default EmberObject.extend(SettingsMixin, MoveMixin, {

  // typeGroup: 'scenes',
  // typeName: 'Scenes',
  // baseTypeName: 'Scenes',

  // project: null,

  // ref: computed('project.ref', function() {
  //   let { project: { ref } } = this;
  //   return ref.collection('scenes');
  // }).readOnly(),

  // query: observed().owner('ref').content(({ ref }) => ref.query()),
  // models: models('query.content').named('project/scenes/scene').mapping((doc, scenes) => ({ scenes, doc })),

  // ordered: computed('models.@each.index', function() {
  //   return this.models.sortBy('index');
  // }).readOnly(),

  visible: computed('ordered.@each.hidden', function() {
    return this.ordered.filter(model => !model.hidden);
  }).readOnly(),

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

    let {
      identifier,
      position,
      size,
      background
    } = assign({
      identifier: 'new-scene',
      position: { x: 4, y: 6 },
      size: { width: 128, height: 64 },
      background: 'white'
    }, opts);

    let doc = this.ref.doc().new({
      index,
      identifier,
      position,
      size,
      background
    });

    await doc.save();
    let model = this.models.findBy('id', doc.id);
    await this.project.onDidCreateScene(model);
    return model;
  }

});
