import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, resolveObservers } from 'ember-cli-zuglet/lifecycle';

const data = key => readOnly(`doc.data.${key}`);

export default EmberObject.extend({

  id: null,
  doc: observed().owner('id').content(({ id, store }) => store.doc(`projects/${id}`).existing()),

  title: data('title'),

  async load() {
    let { doc } = this;
    await resolveObservers(doc);
  }

});
