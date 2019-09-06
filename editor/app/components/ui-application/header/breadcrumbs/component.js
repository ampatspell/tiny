import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNameBindings: [ ':ui-application-breadcrumbs' ],

  breadcrumbs: service(),
  items: readOnly('breadcrumbs.items'),

});
