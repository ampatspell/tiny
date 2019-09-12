import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-sprite-loops-selected' ],

  state: null,
  loop: readOnly('state.loop')

});
