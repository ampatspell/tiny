import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  ref: computed(function() {
    return this.store.collection('projects');
  }).readOnly(),

  uid: readOnly('store.user.uid'),

  query: observed().owner('ref', 'uid').content(({ ref, uid }) => ref.where('owner', '==', uid).query()),
  models: models('query.content').named('project').mapping((doc, projects) => ({ projects, doc })),

  async load({ type }) {
    await resolveObservers(this.query);
    await this.models.map(model => model.load({ type }));
  },

  projectById(id) {
    return this.models.findBy('id', id);
  }

});
