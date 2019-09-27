import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import createSettingsMixin from '../-settings';
import { all } from 'rsvp';
import { assign } from '@ember/polyfills';
import MoveMixin from '../-move';

const SettingsMixin = createSettingsMixin('project', 'sprites');

export default EmberObject.extend(SettingsMixin, MoveMixin, {

  typeGroup: 'sprites',
  typeName: 'Sprites',
  baseTypeName: 'Sprites',

  project: null,

  ref: computed('project.ref', function() {
    let { project: { ref } } = this;
    return ref.collection('sprites');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),
  models: models('query.content').named('project/sprites/sprite').mapping((doc, sprites) => ({ sprites, doc })),

  ordered: computed('models.@each.index', function() {
    return this.models.sortBy('index');
  }).readOnly(),

  selectable: computed('ordered.@each.identifier', function() {
    return this.ordered.filter(sprite => !!sprite.identifier);
  }).readOnly(),

  visible: computed('ordered.@each.hidden', function() {
    return this.ordered.filter(model => !model.hidden);
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
      identifier,
      position,
      size,
      pixel
    } = assign({
      identifier: 'new-sprite',
      position: { x: 4, y: 6 },
      size: { width: 16, height: 16 },
      pixel: 2
    }, opts);

    let doc = this.ref.doc().new({
      index,
      identifier,
      position,
      size,
      pixel
    });

    await doc.save();
    let model = this.models.findBy('id', doc.id);
    return this.project.select(model);
  }

});
