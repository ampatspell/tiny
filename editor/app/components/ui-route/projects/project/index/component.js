import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-projects-project-index' ],

  project: readOnly('model.project'),

  actions: {
    addWorld() {
      this.router.transitionTo('projects.project.worlds.new');
    },
    selectWorld(world) {
      this.router.transitionTo('projects.project.worlds.world', world.id);
    },
    selectSprite(sprite) {
      this.router.transitionTo('projects.project.sprites.sprite', sprite.id);
    },
    addSprite() {
      this.router.transitionTo('projects.project.sprites.new');
    }
  }

});
