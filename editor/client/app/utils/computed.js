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
  if(!current) {
    return;
  }
  let index = array.indexOf(current);
  if(index === -1) {
    return;
  }
  index = index + value;
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

export const normalized = normalize => computed({
  get(key) {
    let value = this[`_${key}`];
    return this[normalize].call(this, value);
  },
  set(key, value) {
    value = this[normalize].call(this, value);
    this[`_${key}`] = value;
    return value;
  }
});

export const bounds = (arrayKey, propertyKey) => computed(`${arrayKey}.@each.${propertyKey}`, function() {
  let models = this.get(arrayKey);

  if(models.length === 0) {
    return;
  }

  let box = {
    min: {
      x: Number.POSITIVE_INFINITY,
      y: Number.POSITIVE_INFINITY,
    },
    max: {
      x: Number.NEGATIVE_INFINITY,
      y: Number.NEGATIVE_INFINITY,
    }
  };

  models.forEach(model => {
    let frame = model.get(propertyKey);
    box.min.x = Math.min(box.min.x, frame.x);
    box.min.y = Math.min(box.min.y, frame.y);
    box.max.x = Math.max(box.max.x, frame.x + frame.width);
    box.max.y = Math.max(box.max.y, frame.y + frame.height);
  });

  return {
    x:      box.min.x,
    y:      box.min.y,
    width:  box.max.x - box.min.x,
    height: box.max.y - box.min.y,
  };
}).readOnly();
