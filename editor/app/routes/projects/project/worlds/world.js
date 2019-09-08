import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { BreadcrumbsMixin, breadcrumb } from '../../../-breadcrumbs';

export default Route.extend(BreadcrumbsMixin, {

  model: route().inline({

    breadcrumb: breadcrumb('world.name', {
      title: model => model.world.name,
      route: 'projects.project.worlds.world'
    }),

    prepare(route, { world_id: id }) {
      let { project } = route.modelFor('projects.project');
      let world = project.worlds.world(id);

      if(!world) {
        this.router.transitionTo('projects.project');
        return;
      }

      this.setProperties({ world });
    },

    async load() {
      await this.world.load();
    },

    willDestroy() {
      this.world && this.world.createThumbnail();
      this._super(...arguments);
    }

  }),

});
