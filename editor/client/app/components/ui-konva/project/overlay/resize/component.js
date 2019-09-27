import Node from '../../../-node';
import { readOnly, not, and } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  model: readOnly('project.editing'),

  resizable: readOnly('model.render.resizable'),
  enabled: not('disabled'),
  unlocked: not('model.chainLocked'),

  isResizable: and('resizable', 'enabled', 'unlocked')

});
