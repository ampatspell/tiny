import { computed } from '@ember/object';
import { A } from '@ember/array';
import { notBlank as _notBlank } from './string';

export const notBlank = key => computed(key, function() {
  let value = this.get(key);
  return _notBlank(value);
}).readOnly();

export const array = () => computed(function() {
  return A();
}).readOnly();
