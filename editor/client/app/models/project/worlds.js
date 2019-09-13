import EmberObject, { computed } from '@ember/object';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  project: null,

  ref: computed('project.ref', function() {
    return this.project.ref.collection('worlds');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => {
    return ref.query();
  }),

  models: models('query.content').named('project/worlds/world').mapping((doc, worlds) => ({ doc, worlds })),

  async load() {
    let { query } = this;
    await resolveObservers(query);
  },

  world(id) {
    return this.models.findBy('id', id);
  }

});
