import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  project: null,

  ref: computed('project.ref', function() {
    let { project: { ref } } = this;
    return ref.collection('sprites');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),
  models: models('query.content').named('project/sprites/sprite').mapping((doc, sprites) => ({ sprites, doc })),

  ordered: computed('models.@each.identifier', function() {
    return this.models.sortBy('identifier');
  }).readOnly(),

  async load({ type }) {
    await resolveObservers(this.query);
    await this.models.map(model => model.load({ type }));
  },

});
