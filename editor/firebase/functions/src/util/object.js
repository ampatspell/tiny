const FieldValue = require('./field-value');

const pick = (object, keys) => {

  if(!object) {
    return;
  }

  const result = {};

  for(const key of keys) {
    let value = object[key];
    if(value === undefined) {
      continue;
    }
    result[key] = value;
  }

  return result;
}

const serverTimestamp = FieldValue.serverTimestamp();

const compact = any => {
  if(serverTimestamp.isEqual(any)) {
    return any;
  } else if(any === null) {
    return null;
  } else if(any instanceof Date) {
    return any;
  } else if(Array.isArray(any)) {
    let arr = [];
    any.forEach(i => {
      let value = compact(i);
      if(value !== undefined) {
        arr.push(value);
      }
    });
    return arr;
  } else if(typeof any === 'object') {
    let ret = {};
    for(let key in any) {
      let value = compact(any[key]);
      if(value !== undefined) {
        ret[key] = value;
      }
    }
    return ret;
  }
  return any;
}

const isNumber = value => typeof value === 'number' && !isNaN(value);

const map = (hash, fn) => {
  let result = [];
  for(let key in hash) {
    let value = hash[key];
    result.push(fn(key, value));
  }
  return result;
}

module.exports = {
  pick,
  map,
  compact,
  isNumber
}
