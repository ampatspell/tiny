import Node from '../../../../../../../../-node';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  frame: readOnly('model.render.frame'),
  pixel: readOnly('model.render.pixel')

});
