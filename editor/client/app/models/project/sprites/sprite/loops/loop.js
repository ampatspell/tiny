import EmberObject from '@ember/object';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'sprites/sprite/loop',
  typeName: 'Loop',

  frames: null,
  doc: null,

  identifier: data('identifier'),

  properties: properties(),

  async load() {
  }

});
