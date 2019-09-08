import Row from '../../../-row';
import { readOnly } from '@ember/object/computed';

export default Row.extend({
  classNameBindings: [ ':node' ],

  subject: readOnly('node'),

});
