import Route from '@ember/routing/route';
import RequirementsMixin from '../-requirements';
import alive from '../../utils/alive';

export default Route.extend(RequirementsMixin, {

  require: 'authenticated',

  async beforeModel() {
    await this._super(...arguments);
    await this.signOut();
  },

  async signOut() {
    await this.store.auth.signOut();
    this.didSignOut();
  },

  didSignOut: alive(function() {
    this.transitionTo('index');
  })

});
