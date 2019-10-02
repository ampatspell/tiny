import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('session', function() {
    this.route('new');
    this.route('delete');
  });

  this.route('projects', function() {
    this.route('new');
    this.route('project', { path: ':project_id' }, function() {
    });
  });

  this.route('emulators', function() {
    this.route('hex', { path: ':hex_id' }, function() {
    });
  });

  this.route('users', function() {
    this.route('new');
  });

  this.route('wip', function() {
  });

});

export default Router;
