import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';
import { notBlank as _notBlank } from './string';
import { assign } from '@ember/polyfills';

export const doc = key => readOnly(`doc.${key}`);
export const data = key => doc(`data.${key}`);

export const notBlank = key => computed(key, function() {
  let value = this.get(key);
  return _notBlank(value);
}).readOnly();

export const array = () => computed(function() {
  return A();
}).readOnly();

export const className = opts => {
  opts = assign({ prefix: `${opts.key}-` }, opts);
  let { key, prefix, value, recompute } = opts;
  return computed(key, function() {
    let string = this.get(key);
    if(string === undefined) {
      string = value;
    }
    if(recompute) {
      string = recompute.call(this, string);
    }
    if(string === undefined) {
      return;
    }
    return `${prefix}${string}`;
  }).readOnly();
}

export const delta = (arrayKey, currentKey, value, ring=true) => computed(`${arrayKey}.[]`, currentKey, function() {
  let array = this[arrayKey];
  let current = this[currentKey];
  let index = array.indexOf(current) + value;
  if(index < 0) {
    if(ring) {
      return array.lastObject;
    }
    return;
  }
  if(index > array.length - 1) {
    if(ring) {
      return array.firstObject;
    }
    return;
  }
  return array.objectAt(index);
}).readOnly();

export const selectedWithDefault = defaultKey => {
  let cacheKeyForKey = key => `_selectedWithDefault_${key}`;
  return computed(defaultKey, {
    get(key) {
      let cacheKey = cacheKeyForKey(key);
      let selected = this[cacheKey];
      if(selected === undefined) {
        selected = this.get(defaultKey) || null;
        this._selected = selected;
      }
      return selected;
    },
    set(key, value) {
      let cacheKey = cacheKeyForKey(key);
      this[cacheKey] = value;
      return value;
    }
  });
};
