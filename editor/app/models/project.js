import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { observed, resolveObservers, model } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';

const data = key => readOnly(`doc.data.${key}`);

export default EmberObject.extend({

  id: null,
  doc: observed().owner('id').content(({ id, store }) => store.doc(`projects/${id}`).existing()),

  title: data('title'),

  sprites: model().named('project/sprites').mapping(project => ({ project })),

  async load() {
    let { doc, sprites } = this;
    await all([
      resolveObservers(doc),
      sprites.load()
    ]);
  }

});
