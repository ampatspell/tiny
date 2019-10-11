import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';
import { assign } from '@ember/polyfills';

export default EmberObject.extend({

  project: null,

  ref: computed('project.ref', function() {
    return this.project.ref.collection('entities');
  }).readOnly(),

  query: observed().owner('ref').content(({ ref }) => ref.query()),

  models: models('query.content')
    .object('data.type')
    .named(doc => `project/entities/${doc.get('data.type')}`)
    .mapping((doc, { project }) => ({ project, doc })),

  async load() {
    await resolveObservers(this.query);
    await all(this.models.map(model => model.load()));
  },

  _parentId(parent) {
    if(parent === this.project) {
      return null;
    }
    return parent.id;
  },

  async createModel(parent, props) {
    parent = this._parentId(parent);
    let doc = this.ref.doc().new(assign({ parent }, props));
    await doc.save();
    return this.models.findBy('id', doc.id);
  }

});
