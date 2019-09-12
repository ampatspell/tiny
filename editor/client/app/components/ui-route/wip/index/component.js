import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-wip-index' ],

  frame: readOnly('model.frames.firstObject'),

});
