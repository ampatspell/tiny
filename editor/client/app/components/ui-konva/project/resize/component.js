import Node from '../../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  nodeClassName: 'group',

  selection: readOnly('project.selection'),

  isResizable: computed('selection.render.resizable', 'disabled', function() {
    let { selection, disabled } = this;
    if(!selection || disabled) {
      return;
    }
    return selection.render.resizable;
  }).readOnly(),

});
