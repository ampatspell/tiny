import Route from '@ember/routing/route';
import { route, model } from 'ember-cli-zuglet/lifecycle';
import RequirementsMixin from './-requirements';
import { BreadcrumbsMixin, breadcrumb } from './-breadcrumbs';

export default Route.extend(RequirementsMixin, BreadcrumbsMixin, {

  require: 'authenticated',

  model: route().inline({

    breadcrumb: breadcrumb({
      title: 'Projects',
      route: 'projects'
    }),

    projects: model().named('projects').mapping(() => ({})),

    prepare() {
    },

    async load() {
      await this.projects.load({ type: 'list' });
    }

  })

});
