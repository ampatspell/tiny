import Node from '../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  model: readOnly('project.editing'),

  isResizable: computed('model.render.resizable', 'disabled', function() {
    let { model, disabled } = this;
    if(!model || disabled) {
      return;
    }
    return model.render.resizable;
  }).readOnly(),

});
