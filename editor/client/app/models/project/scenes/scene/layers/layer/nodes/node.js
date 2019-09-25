import EmberObject from '@ember/object';
import { or } from '@ember/object/computed';
import DocMixin, { data } from '../../../../../../-doc';

export {
  data
}

export default EmberObject.extend(DocMixin, {

  nodes: null,
  doc: null,

  type: data('type'),
  index: data('index'),
  identifier: data('identifier'),

  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('nodes.chainHidden', 'hidden'),
  chainLocked: or('nodes.chainLocked', 'locked'),

  async load() {
  }

});
