import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-selection' ],

  state: null,
  selection: readOnly('state.selection')

});
