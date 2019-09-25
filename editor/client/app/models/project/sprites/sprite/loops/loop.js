import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'sprites/sprite/loop',
  typeName: 'Loop',

  project: readOnly('loops.project'),

  frames: null,
  doc: null,

  identifier: data('identifier'),

  properties: properties(),

  async load() {
  }

});
