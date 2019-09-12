import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-route-index' ],

  actions: {
    signIn() {
      this.router.transitionTo('session.new');
    }
  }

});
