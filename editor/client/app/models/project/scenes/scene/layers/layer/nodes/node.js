import EmberObject from '@ember/object';
import { or } from '@ember/object/computed';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';

export {
  data
}

export default EmberObject.extend(DocMixin, {

  typeGroup: 'scenes/scene/layer/node',
  typeName: 'Node',

  nodes: null,
  doc: null,

  type: data('type'),
  index: data('index'),
  identifier: data('identifier'),

  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('nodes.chainHidden', 'hidden'),
  chainLocked: or('nodes.chainLocked', 'locked'),

  properties: properties(),

  async load() {
  }

});
