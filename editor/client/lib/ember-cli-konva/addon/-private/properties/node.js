import { assign } from '@ember/polyfills';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import destroyable from 'ember-cli-zuglet/-private/util/destroyable';

const property = opts => destroyable({
  reusable: () => true,
  create(key) {
    let parent = this;
    return getOwner(this).factoryFor('konva:definition/property').create({ parent, key, opts });
  },
}).meta({ isKonvaNodeDefinition: true });

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
