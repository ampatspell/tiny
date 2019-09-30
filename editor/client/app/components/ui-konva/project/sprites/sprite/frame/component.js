import Node from '../../../../-node';
import { readOnly, not, and } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  sprite: readOnly('model.sprite'),
  isAltPressed: readOnly('sprite.render.isAltPressed'),
  isEditing: readOnly('sprite.isEditing'),
  unlocked: not('sprite.chainLocked'),
  enabled: not('disabled'),

  isMovingPixelsEnabled: and('sprite', 'enabled', 'unlocked', 'isEditing', 'isAltPressed'),

});
