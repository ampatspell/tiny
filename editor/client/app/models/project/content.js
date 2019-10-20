import EmberObject, { computed } from '@ember/object';
import { observed, models, resolveObservers } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';
import { assign } from '@ember/polyfills';
import { array } from 'editor/utils/computed';

export default EmberObject.extend({

  project: null,

  ref: computed('project.ref', function() {
    return this.project.ref.collection('entities');
  }).readOnly(),

  _adding: array(),

  query: observed().owner('ref').content(owner => owner.ref.query({
    doc: path => owner._adding.findBy('path', path)
  })),

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
    this._adding.pushObject(doc);
    try {
      await doc.save({ token: true });
      return this.models.findBy('id', doc.id);
    } finally {
      this._adding.removeObject(doc);
    }
  }

});
