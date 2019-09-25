import EmberObject from '@ember/object';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';

export default EmberObject.extend(DocMixin, {

  typeName: 'Frame',

  frames: null,
  doc: null,

  index: data('index'),
  identifier: data('identifier'),

  properties: properties(),

  async load() {
  }

});
