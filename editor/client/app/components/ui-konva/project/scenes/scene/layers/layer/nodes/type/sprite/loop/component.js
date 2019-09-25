import Node from '../-node';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  pixelFrame: readOnly('model.pixelFrame'),

});
