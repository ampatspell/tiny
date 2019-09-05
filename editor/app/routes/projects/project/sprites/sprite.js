import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';

export default Route.extend({

  model: route().inline({

    prepare(route, { sprite_id: id }) {
      let { project } = route.modelFor('projects.project');
      let sprite = project.sprites.sprite(id);

      if(!sprite) {
        this.transitionTo('projects.project');
        return;
      }

      this.setProperties({ sprite });
    },

    async load() {
      await this.sprite.load();
    },

    willDestroy() {
      this.sprite.createThumbnail();
      this._super(...arguments);
    }

  }),

});
