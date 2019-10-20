import Node from '../../../-node';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  model: readOnly('project.selection.editing'),
  resizable: readOnly('model.render.resizable')

});
