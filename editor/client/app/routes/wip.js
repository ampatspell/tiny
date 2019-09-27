import Route from '@ember/routing/route';
import RequirementsMixin from './-requirements';
import { route, model, observed, resolveObservers } from 'ember-cli-zuglet/lifecycle';

export default Route.extend(RequirementsMixin, {

  require: 'authenticated',

  model: route().inline({

    id: 'lSYrAHenmCT2nStV3ydf',

    doc: observed().owner('id').content(({ id, store }) => store.doc(`projects/${id}`).existing()),
    project: model().owner('doc').named('project').mapping(({ doc }) => ({ doc })),

    prepare() {
    },

    async load() {
      await resolveObservers(this.doc);
      await this.project.load({ type: 'detail' });
    }

  })

});
