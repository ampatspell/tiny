import { computed } from '@ember/object';
import { assign } from '@ember/polyfills';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';

const property = opts => {
  return computed(function(key) {
    let parent = this;
    return getOwner(this).factoryFor('konva:definition').create({ parent, key, opts });
  }).meta({}).readOnly();
}

const compact = array => A(array).compact();

const build = (opts, nested={}) => {
  opts = assign({}, opts, nested);
  let prop = property(opts);
  prop.owner = (...args) => build(opts, { parent: compact(args) });
  prop.named = arg => build(opts, { named: arg });
  prop.content = arg => build(opts, { content: arg });
  return prop;
}

export default () => {
  let opts = {
    parent: [],
    named: undefined,
    content: undefined
  };
  return build(opts, {});
}
