import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, resolveObservers, models } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  uid: readOnly('store.user.uid'),

  query: observed().owner('uid').content(({ uid, store }) => store.collection('projects').where('owner', '==', uid).query()),
  projects: models('query.content').named('lists/projects/project').mapping((doc, projects) => ({ doc, projects })),

  prepare() {
  },

  async load() {
    await resolveObservers(this.query);
  }

});
