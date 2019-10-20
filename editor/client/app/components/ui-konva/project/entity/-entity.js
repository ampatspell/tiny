import Node from '../../-node';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  model: null,
  project: null,

  _frame: readOnly('model.render.frame'),

});
