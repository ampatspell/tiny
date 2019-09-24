import EmberObject, { computed } from '@ember/object';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';

export default EmberObject.extend({

  project: null,

  ref: computed('project.ref', function() {
    return this.project.ref.collection('sprites');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => {
    return ref.orderBy('identifier').query();
  }),

  models: models('query.content').named('project/sprites/sprite').mapping((doc, sprites) => ({ doc, sprites })),

  async load() {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load()));
  },

  sprite(id) {
    return this.models.findBy('id', id);
  }

});
