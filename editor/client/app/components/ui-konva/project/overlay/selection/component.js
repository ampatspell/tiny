import Node from '../../../-node';
import { readOnly } from '@ember/object/computed';

export default Node.extend({
  nodeClassName: 'group',

  models: readOnly('project.selection.highlight'),
  stroke: 'rgba(96,190,253,0.75)'

});
