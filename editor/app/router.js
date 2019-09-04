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
      this.route('sprites', function() {
        this.route('sprite', { path: ':sprite_id' }, function() {
        });
      });
    });
  });

  this.route('wip', function() {
    this.route('foobar');
  });

});

export default Router;
