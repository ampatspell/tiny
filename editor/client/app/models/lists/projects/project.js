import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

const doc = key => readOnly(`doc.${key}`);
const data = key => doc(`data.${key}`);

export default EmberObject.extend({

  projects: null,
  doc: null,

  id: doc('id'),
  title: data('title'),

});
