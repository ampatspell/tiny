import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  sprite: null,

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
    await this.models.map(model => model.load({ type }));
  },

});
