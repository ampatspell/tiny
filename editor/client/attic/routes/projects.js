import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import RequirementsMixin from './-requirements';
import { BreadcrumbsMixin, breadcrumb } from './-breadcrumbs';

export default Route.extend(RequirementsMixin, BreadcrumbsMixin, {

  require: 'authenticated',

  model: route().inline({

    breadcrumb: breadcrumb({
      title: 'Projects',
      route: 'projects'
    }),

    prepare() {
    }

  })

});
