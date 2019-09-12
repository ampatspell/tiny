import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-session-index' ],

  user: readOnly('store.user'),

  actions: {
    signOut() {
      this.router.transitionTo('session.delete');
    }
  }

});
