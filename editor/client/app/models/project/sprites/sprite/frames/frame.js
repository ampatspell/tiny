import EmberObject from '@ember/object';
import { doc, data } from 'editor/utils/computed';

export default EmberObject.extend({

  frames: null,
  doc: null,

  id: doc('id'),
  ref: doc('ref'),

  index: data('index'),
  identifier: data('identifier'),

  async load() {
  }

});
