import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';

export default EmberObject.extend({

  sprite: null,

  ref: computed('sprite.ref', function() {
    let { sprite: { ref } } = this;
    return ref.collection('loops');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),
  models: models('query.content').named('project/sprites/sprite/loops/loop').mapping((doc, sprite) => ({ sprite, doc })),

  ordered: computed('models.@each.identifier', function() {
    return this.models.sortBy('identifier');
  }).readOnly(),

  async load({ type }) {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load({ type })));
  },

});
