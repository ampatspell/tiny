import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { and, not, or } from '@ember/object/computed';
import RequirementsMixin from '../-requirements';
import { route } from 'ember-cli-zuglet/lifecycle';
import { notBlank } from '../../utils/computed';
import alive from '../../utils/alive';

export default Route.extend(RequirementsMixin, {

  require: 'not-authenticated',

  model: route().inline({

    authRequirements: service(),

    email: null,
    password: null,

    hasEmail: notBlank('email'),
    hasPassword: notBlank('password'),

    isValid: and('hasEmail', 'hasPassword'),
    isInvalid: not('isValid'),
    isBusy: false,
    isDisabled: or('isInvalid', 'isBusy'),

    error: null,

    prepare() {
    },

    async save() {
      let { email, password, store } = this;
      this.setProperties({ isBusy: true, error: null });
      try {
        await store.auth.methods.email.signUp(email, password);
        this.didSave();
      } catch(error) {
        this.saveDidFail(error);
        return false;
      }
    },

    didSave: alive(function() {
      this.setProperties({ isBusy: false });
      if(!this.authRequirements.retryStoredTransition()) {
        this.router.transitionTo('index');
      }
    }),

    saveDidFail: alive(function(error) {
      this.setProperties({ isBusy: false, error });
    })

  })

});
