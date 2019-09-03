import Service, { inject as service } from '@ember/service';
import { classify } from '@ember/string';
import { assert } from '@ember/debug';
import { readOnly } from '@ember/object/computed';

export default Service.extend({

  store: service(),

  user: readOnly('store.user'),

  storeTransition(transition) {
    this.transition = transition;
  },

  retryStoredTransition() {
    let transition = this.transition;
    if(transition) {
      this.transition = null;
      transition.retry();
      return true;
    }
    return false;
  },

  validateIsAuthenticated(user) {
    if(!user) {
      return 'sign-in';
    }
    return true;
  },

  validateIsNotAuthenticated(user) {
    if(user) {
      return false;
    }
    return true;
  },

  validate(route, requirement, ...args) {
    if(!requirement) {
      return true;
    }
    let name = `validateIs${classify(requirement)}`;
    let fn = this[name];
    assert(`auth requirement '${name}' is not declared`, !!fn);
    let { user } = this;
    let result = fn.call(this, user, ...args);
    return result;
  }

});
