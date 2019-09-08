import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { BreadcrumbsMixin, breadcrumb } from '../../../-breadcrumbs';

export default Route.extend(BreadcrumbsMixin, {

  model: route().inline({

    breadcrumb: breadcrumb('sprite.name', {
      title: model => model.sprite.name,
      route: 'projects.project.sprites.sprite'
    }),

    prepare(route, { sprite_id: id }) {
      let { project } = route.modelFor('projects.project');
      let sprite = project.sprites.sprite(id);

      if(!sprite) {
        this.router.transitionTo('projects.project');
        return;
      }

      this.setProperties({ sprite });
    },

    async load() {
      await this.sprite.load();
    },

    willDestroy() {
      this.sprite && this.sprite.createThumbnail();
      this._super(...arguments);
    }

  }),

});
