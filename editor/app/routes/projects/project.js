import Route from '@ember/routing/route';
import { route, model } from 'ember-cli-zuglet/lifecycle';

export default Route.extend({

  model: route().inline({

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
