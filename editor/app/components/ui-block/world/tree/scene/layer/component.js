import Row from '../../-row';
import { readOnly } from '@ember/object/computed';

export default Row.extend({
  classNameBindings: [ ':layer' ],

  subject: readOnly('layer'),

});
