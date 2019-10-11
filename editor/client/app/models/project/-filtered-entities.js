import EmberObject, { computed } from '@ember/object';
import { readOnly, filterBy } from '@ember/object/computed';

export default baseType => EmberObject.extend({

  model: null,
  project: readOnly('model.project'),

  models: filterBy('model.entities.models', 'baseType', baseType),

  ordered: computed('models.@each.index', function() {
    return this.models.slice().sortBy('index');
  }).readOnly(),

  identified: computed('ordered.@each.identifier', function() {
    return this.ordered.filter(model => !!model.identifier);
  }).readOnly(),

  //

  _nextIndex() {
    let last = this.ordered.lastObject;
    let index = 0;
    if(last) {
      index = last.index + 1;
    }
    return index;
  },

  createModel(opts) {
    if(typeof opts.index !== 'number') {
      opts.index = this._nextIndex();
    }
    return this.project.content.createModel(this.model, opts);
  },

});
