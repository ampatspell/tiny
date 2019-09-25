import EmberObject from '@ember/object';
import { doc, data } from 'editor/utils/computed';

export default EmberObject.extend({

  typeName: 'Loop',

  frames: null,
  doc: null,

  id: doc('id'),
  ref: doc('ref'),

  identifier: data('identifier'),

  async load() {
  }

});
