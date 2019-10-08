import Render from './-render';
import { readOnly } from '@ember/object/computed';

export default Render.extend({

  pixel: readOnly('model.pixel'),

  // selection: readOnly('model.selection.render.selection')

});
