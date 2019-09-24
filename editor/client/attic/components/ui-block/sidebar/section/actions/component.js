import Component from '@ember/component';
import { className } from 'editor/utils/computed';

export default Component.extend({
  classNameBindings: [ ':actions', '_type' ],

  _type: className({ key: 'type', value: 'regular' }),

});
