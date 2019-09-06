import Route from '@ember/routing/route';
import { route, model } from 'ember-cli-zuglet/lifecycle';
import { BreadcrumbsMixin, breadcrumb } from '../-breadcrumbs';

export default Route.extend(BreadcrumbsMixin, {

  model: route().inline({

    breadcrumb: breadcrumb('project.title', {
      title: model => model.project.title,
      route: 'projects.project'
    }),

    id: null,
    project: model().owner('id').named('project').mapping(({ id }) => ({ id })),

    prepare(route, { project_id: id }) {
      this.setProperties({ id });
    },

    async load() {
      await this.project.load();
    }

  }),

});
