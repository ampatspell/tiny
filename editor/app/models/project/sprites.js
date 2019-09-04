import EmberObject, { computed } from '@ember/object';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  project: null,

  path: computed('project.doc.path', function() {
    let project = this.project.doc.path;
    return `${project}/sprites`;
  }).readOnly(),

  query: observed().owner('path').content(({ path, store }) => {
    return store.collection(path).orderBy('identifier').query();
  }),

  models: models('query.content').named('project/sprites/sprite').mapping((doc, sprites) => ({ doc, sprites })),

  async load() {
    let { query } = this;
    await resolveObservers(query);
  },

  sprite(id) {
    return this.models.findBy('id', id);
  }

});
