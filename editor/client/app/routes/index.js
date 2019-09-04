import Route from '@ember/routing/route';

export default Route.extend({

  beforeModel() {
    if(this.store.user) {
      this.transitionTo('projects');
    }
  }

});
