import EmberObject from '@ember/object';
import DocMixin, { data } from './-doc';
import { model } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';

export default EmberObject.extend(DocMixin, {

  projects: null,
  doc: null,

  title: data('title'),
  locked: data('locked'),

  sprites: model().named('project/sprites').mapping(project => ({ project })),

  async load({ type }) {
    if(type === 'detail') {
      await all([
        this.sprites.load({ type })
      ]);
    }
  }

});
