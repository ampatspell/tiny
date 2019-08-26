import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':ui-application-header' ],

  actions: {
    index() {
      this.router.transitionTo('index');
    }
  }

});
