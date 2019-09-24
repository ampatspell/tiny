import EmberObject, { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import { A } from '@ember/array';
import Node from '../node';

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
    return this._createModel();
  }),

  init() {
    this._super(...arguments);
    this._startObserving();
  },

  _createModel() {
    let { parent, opts } = this;

    let call = arg => {
      if(typeof arg === 'function') {
        return arg.call(parent, parent);
      }
      return arg;
    }

    let name = call(opts.named);
    if(!name) {
      return;
    }

    let props = call(opts.mapping);
    parent = Node.detectInstance(parent) ? parent : null;

    return this.store.models.create(name, assign({ parent }, props));
  },

  // _destroyModel() {
  //   let { model } = this;
  //   if(!model) {
  //     return;
  //   }
  //   this.setProperties({ model: null });
  //   model.unmount();
  // },

  _withOwnerKeys(cb) {
    let { parent, opts } = this;
    A(opts.parent).forEach(key => cb(parent, key));
  },

  _ownerKeyDidChange() {
    // this._destroyModel();
    // this._createModel();
    // if(this._mounted) {
    //   this._mountModel();
    // }
  },

  _startObserving() {
    this._withOwnerKeys((owner, key) => owner.addObserver(key, this, this._ownerKeyDidChange));
  },

  _stopObserving() {
    this._withOwnerKeys((owner, key) => owner.removeObserver(key, this, this._ownerKeyDidChange));
  },

});
