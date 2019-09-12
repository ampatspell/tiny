import Component from '@ember/component';

export default Component.extend({
  classNameBindings: [ ':item', 'item.route::faded' ],

  click() {
    let { item: { route } } = this;
    route && this.router.transitionTo(route);
  }

});
