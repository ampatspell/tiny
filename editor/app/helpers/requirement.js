import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
// import { observer } from '@ember/object';
// import { cancel, next } from '@ember/runloop';

export default Helper.extend({

  authRequirements: service(),

  compute([ requirement, ...rest ]) {
    return this.authRequirements.validate(null, requirement, ...rest);
  },

  // scheduleRecompute() {
  //   cancel(this._userRolesDidChange);
  //   this._userRolesDidChange = next(() => this.recompute());
  // },

  // userRolesDidChange: observer('authRequirements.user.roles.[]', function() { // eslint-disable-line ember/no-observers
  //   this.scheduleRecompute();
  // }),

  // willDestroy() {
  //   this._super(...arguments);
  //   cancel(this._userRolesDidChange);
  // },

});
