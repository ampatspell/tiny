import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('wip', function() {
    this.route('foobar');
    this.route('editor');
  });

});

export default Router;
