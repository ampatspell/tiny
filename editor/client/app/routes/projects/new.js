import Route from '@ember/routing/route';
import { route } from 'ember-cli-zuglet/lifecycle';
import { BreadcrumbsMixin, breadcrumb } from '../-breadcrumbs';
import { notBlank } from 'editor/utils/computed';
import { readOnly, and, not, or } from '@ember/object/computed';
import alive from 'editor/utils/alive';

export default Route.extend(BreadcrumbsMixin, {

  model: route().inline({

    breadcrumb: breadcrumb({
      title: "Add Project",
      route: 'projects.project.new'
    }),

    uid: readOnly('store.user.uid'),

    title: null,

    hasTitle: notBlank('title'),

    isValid: and('hasTitle'),
    isInvalid: not('isValid'),
    isBusy: false,
    isDisabled: or('isInvalid', 'isBusy'),

    prepare() {
    },

    update(props) {
      this.setProperties(props);
    },

    async save() {
      this.setProperties({ isBusy: true });
      let { store, title, uid: owner } = this;
      let doc = store.collection('projects').doc().new({
        owner,
        title
      });
      await doc.save();
      this.didSave(doc.id);
    },

    didSave: alive(function(id) {
      this.router.transitionTo('projects.project', id);
    }),

  })

});
