import Node from '../-node';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

export default Node.extend({

  selection: readOnly('model.project.selection'),

  background: computed('selection.layer', 'model', function() {
    let { model, selection } = this;
    if(selection === model) {
      return true;
    }
    if(selection && selection.layer === model) {
      return true;
    }
    return false;
  }).readOnly(),

});
