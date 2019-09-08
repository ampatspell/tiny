import Node from './node';
import { readOnly } from '@ember/object/computed';

const data = path => readOnly(`doc.data.${path}`);

export default Node.extend({

  name: 'Fill',

  color: data('color')

});
