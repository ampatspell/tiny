import Node from '../../../../../../../../-node';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  pixelFrame:    readOnly('model.pixelFrame'),
  absolutePixel: readOnly('model.absolutePixel')

});
