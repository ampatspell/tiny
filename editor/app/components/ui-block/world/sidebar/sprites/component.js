import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-block-world-sidebar-sprites' ],

  state: null,
  world: readOnly('state.world'),
  sprites: readOnly('state.sprites'),

});
