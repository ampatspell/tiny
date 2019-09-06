import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { BreadcrumbsMixin, breadcrumb } from '../../-breadcrumbs';

export default Route.extend(BreadcrumbsMixin, {

  model: route().inline({

    breadcrumb: breadcrumb({
      title: 'Worlds',
    }),

    prepare() {
    }

  })

});
