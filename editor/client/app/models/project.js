import EmberObject from '@ember/object';
import { doc, data } from 'editor/utils/computed';

export default EmberObject.extend({

  projects: null,
  doc: null,

  id: doc('id'),
  ref: doc('ref'),

  title: data('title'),

  async load({ type }) {
  }

});
