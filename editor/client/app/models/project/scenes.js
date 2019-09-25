import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import createSettingsMixin from '../-settings';
import { assign } from '@ember/polyfills';
import { all } from 'rsvp';

const SettingsMixin = createSettingsMixin('project', 'scenes');

export default EmberObject.extend(SettingsMixin, {

  project: null,

  ref: computed('project.ref', function() {
    let { project: { ref } } = this;
    return ref.collection('scenes');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),
  models: models('query.content').named('project/scenes/scene').mapping((doc, scenes) => ({ scenes, doc })),

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

    let {
      name,
      identifier,
      position,
      size
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
      background: 'white'
    });

    await doc.save();
    return this.models.findBy('doc', doc);
  }

});
