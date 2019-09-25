import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'sprites/sprite/frame',
  typeName: 'Frame',

  project: readOnly('frames.project'),

  frames: null,
  doc: null,

  index: data('index'),
  identifier: data('identifier'),
  bytes: data('bytes'),

  properties: properties(),

  async load() {
  }

});
