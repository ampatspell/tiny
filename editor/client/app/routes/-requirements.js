import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

const results = {
  'sign-in': (route, transition) => {
    route.authRequirements.storeTransition(transition);
    route.transitionTo('session.new');
  },
  'denied': route => {
    route.transitionTo('index');
  }
};

export default Mixin.create({

  authRequirements: service(),

  require: null,

  validateAuthRequirement(requirement, ...args) {
    return this.authRequirements.validate(this, requirement, ...args);
  },

  beforeModel(transition) {
    let result = this.validateAuthRequirement(this.require);
    if(result === true) {
      return;
    }
    if(result === false) {
      result = 'denied';
    }
    let mapped = results[result];
    mapped(this, transition);
  }

});
