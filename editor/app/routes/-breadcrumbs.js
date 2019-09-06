import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import { inject as service } from '@ember/service';

export const breadcrumb = (...args) => {
  let opts = assign({}, args.pop());
  return computed(...args, function() {
    let prop = key => {
      let value = opts[key];
      if(typeof value === 'function') {
        value = value.call(this, this);
      }
      return value;
    }

    let layout = prop('layout');
    let title = prop('title');
    let route = prop('route');

    return {
      layout,
      title,
      route
    };
  }).readOnly();
}

export const BreadcrumbsMixin = Mixin.create({

  breadcrumbs: service(),

  setupController(controller, model) {
    this.breadcrumbs.remove(controller.model);
    this._super(...arguments);
    this.breadcrumbs.add(model);
  },

  deactivate() {
    this._super(...arguments);
    this.breadcrumbs.remove(this.modelFor(this.routeName));
  }

});
