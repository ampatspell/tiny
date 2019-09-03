import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-application-header-auth' ],

  user: readOnly('store.user'),
  email: readOnly('user.email')

});
