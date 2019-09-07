import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';

const doc = path => readOnly(`doc.${path}`);
const data = path => doc(`data.${path}`);

export default EmberObject.extend({

  doc: null,
  scene: null,

  id: doc('id'),

  type: data('type'),
  position: data('position.serialized'),
  size: data('size.serialized'),

});
