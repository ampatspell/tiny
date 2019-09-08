import Row from '../-row';
import { readOnly } from '@ember/object/computed';

export default Row.extend({
  classNameBindings: [ ':scene' ],

  subject: readOnly('scene'),

});
