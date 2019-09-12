import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { className } from 'editor/utils/computed';

export default Component.extend({
  classNameBindings: [ ':ui-application', '_type' ],

  breadcrumbs: service(),

  type: readOnly('breadcrumbs.items.lastObject.layout'),
  _type: className({ key: 'type', value: 'regular' }),

});
