import Node from '../../-node';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  model: null,
  project: null,

  renderEntities: readOnly('model.render.renderEntities'),

});
