import Render from './-render';
import { readOnly } from '@ember/object/computed';

export default Render.extend({

  expandable: true,

  pixel: readOnly('model.pixel'),

  hidden: readOnly('model.hidden'),
  locked: readOnly('model.locked')

});
