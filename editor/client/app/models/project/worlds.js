import EmberObject, { computed } from '@ember/object';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  project: null,

  path: computed('project.doc.path', function() {
    let project = this.project.doc.path;
    return `${project}/worlds`;
  }).readOnly(),

  query: observed().owner('path').content(({ path, store }) => {
    return store.collection(path).orderBy('name').query();
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
