import EmberObject, { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import { A } from '@ember/array';

const property = opts => {
  return computed(function(key) {
    let parent = this;
    return this.store.models.create('konva/properties/node', { parent, key, opts });
  }).meta({ konvaNodeProperty: true }).readOnly();
}

const compact = array => A(array).compact();

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = property(opts);
  prop.owner = (...args) => build(opts, { parent: compact(args) });
  prop.named = arg => build(opts, { named: arg });
  prop.mapping = arg => build(opts, { mapping: arg });
  return prop;
}

export const node = () => {
  let opts = {
    parent: [],
    named: undefined,
    mapping: undefined
  };
  return build(opts, {});
}

export default EmberObject.extend({

  parent: null,
  key: null,
  opts: null,

  model: computed(function() {
    let { parent, opts } = this;
    let props = this.opts.mapping.call(parent, parent);
    return this.store.models.create(opts.named, assign(props, { parent }));
  }).readOnly(),

  mount() {
    this.model.mount();
    this.startObserving();
  },

  unmound() {
  },

  startObserving() {
  },

});
