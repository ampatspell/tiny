import Node from '../../../-node';
import { readOnly } from '@ember/object/computed';

export default Node.extend({
  nodeClassName: 'group',

  model: readOnly('project.selection.editing'),
  stroke: 'rgba(255,102,97,0.75)'

});
