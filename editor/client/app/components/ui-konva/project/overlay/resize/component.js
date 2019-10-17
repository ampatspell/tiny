import Node from '../../../-node';
import { readOnly, and, not } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  model: readOnly('project.selection.editing'),

  enabled: not('disabled'),
  resizable: and('model.render.resizable', 'enabled')

});
