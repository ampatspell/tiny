import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { data } from './-doc';
import { model } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';
import { properties } from './properties';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'project',
  typeName: 'Project',

  projects: null,
  doc: null,

  title: data('title'),

  hidden: data('hidden'),
  locked: data('locked'),
  chainHidden: readOnly('hidden'),
  chainLocked: readOnly('locked'),

  properties: properties(),

  sprites: model().named('project/sprites').mapping(project => ({ project })),
  scenes: model().named('project/scenes').mapping(project => ({ project })),

  selection: null,

  select(selection) {
    selection = selection || null;
    this.setProperties({ selection });
  },

  async load({ type }) {
    setGlobal({ project: this });
    if(type === 'detail') {
      await all([
        this.sprites.load({ type }),
        this.scenes.load({ type })
      ]);
    }
  }

});
