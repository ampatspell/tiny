import EmberObject, { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { data } from './-doc';
import { model } from 'ember-cli-zuglet/lifecycle';
import { all } from 'rsvp';
import { properties } from './properties';
import { EditorMixin } from './project/editor';

export default EmberObject.extend(DocMixin, EditorMixin, {

  typeGroup: 'project',
  typeName: 'Project',

  projects: null,
  doc: null,

  title: data('title'),
  pixel: data('pixel'),
  token: data('token'),

  hidden: data('hidden'),
  locked: data('locked'),
  chainHidden: readOnly('hidden'),
  chainLocked: readOnly('locked'),

  properties: properties(),

  sprites: model().named('project/sprites').mapping(project => ({ project })),
  scenes: model().named('project/scenes').mapping(project => ({ project })),
  render: model().named('project/render').mapping(model => ({ model })),

  //

  selection: null,

  // selections: computed('selection.selections', function() {
  //   let { selection } = this;
  //   if(!selection) {
  //     return;
  //   }
  //   let { selections } = selection;
  //   if(selections) {
  //     return selections;
  //   }
  //   return [ selection ];
  // }).readOnly(),

  select(selection) {
    selection = selection || null;
    this.setProperties({ selection });
    return selection;
  },

  deselect() {
    this.select(null);
  },

  selectIf(current, selection) {
    if(this.selection !== current) {
      return;
    }
    this.select(selection);
  },

  onShortcutDigit(pixel) {
    if(pixel < 1) {
      return;
    }
    let selection = this.selection;
    if(!selection) {
      this.update({ pixel });
    } else {
      selection.onShortcutDigit && selection.onShortcutDigit(pixel);
    }
  },

  async load({ type }) {
    if(type === 'detail') {
      setGlobal({ project: this });
      await all([
        this.sprites.load({ type }),
        this.scenes.load({ type })
      ]);
    }
  }

});
