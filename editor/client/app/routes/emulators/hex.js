import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { BreadcrumbsMixin, breadcrumb } from '../-breadcrumbs';

export default Route.extend(BreadcrumbsMixin, {

  model: route().inline({

    breadcrumb: breadcrumb({
      title: "Emulator"
    }),

    id: null,
    url: null,

    prepare(route, { hex_id }) {
      this.setProperties({ id: hex_id });
    },

    async load() {
      let ref = this.store.storage.ref(`builds/${this.id}.hex`);
      await ref.url.load();
      let url = ref.url.value;
      this.setProperties({ url });
    }

  })

});
