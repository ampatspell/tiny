import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-route-projects-project-index' ],

  project: readOnly('model.project'),

  actions: {
    sprite(sprite) {
      this.router.transitionTo('projects.project.sprites.sprite', sprite.id);
    },
    newSprite() {
      this.router.transitionTo('projects.project.sprites.new');
    }
  }

});
