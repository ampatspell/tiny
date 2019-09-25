import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { A } from '@ember/array';
import { notBlank as _notBlank } from './string';
import { assign } from '@ember/polyfills';

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

// export const delta = (arrayKey, currentKey, value) => computed(`${arrayKey}.[]`, currentKey, function() {
//   let array = this[arrayKey];
//   let current = this[currentKey];
//   let index = array.indexOf(current) + value;
//   if(index < 0 || index > array.length - 1) {
//     return;
//   }
//   return array.objectAt(index);
// }).readOnly();

// export const current = (arrayKey, defaultIndex=0) => {
//   let getIndexKey = key => `_${key}_index`
//   return computed(`${arrayKey}.[]`, {
//     get(key) {
//       let array = this[arrayKey];
//       let indexKey = getIndexKey(key);
//       let index = this[indexKey];
//       let value = array.objectAt(index);
//       return value || array.objectAt(defaultIndex);
//     },
//     set(key, value) {
//       let array = this[arrayKey];
//       let index = array.indexOf(value);
//       if(index == -1) {
//         index = defaultIndex;
//         value = array.objectAt(defaultIndex);
//       }
//       this[getIndexKey(key)] = index;
//       return value;
//     }
//   });
// }

export const doc = key => readOnly(`doc.${key}`);
export const data = key => doc(`data.${key}`);
