import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { BreadcrumbsMixin, breadcrumb } from '../-breadcrumbs';

export default Route.extend(BreadcrumbsMixin, {

  model: route().inline({

    breadcrumb: breadcrumb('project.title', {
      title: owner => owner.project.title,
      route: 'projects.project'
    }),

    id: null,
    project: null,

    prepare(route, { project_id }) {
      let { projects } = route.modelFor('projects');

      let project = projects.projectById(project_id);
      if(!project) {
        route.transitionTo('projects');
        return;
      }

      this.setProperties({ project });
    },

    async load() {
      await this.project.load({ type: 'detail' });
    }

  })

});
