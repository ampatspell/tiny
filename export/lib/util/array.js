const get = (object, key) => {
  let keys = key.split('.');
  let len = keys.length;
  let i = 0;
  while(i < len) {
    object = object[keys[i]];
    i++;
  }
  return object;
}

const sortBy = (array, key, direction='asc') => {

  let compare = (a, b) => {
    let av = get(a, key);
    let bv = get(b, key);

    if(av < bv) {
      return -1;
    }
    if(av > bv) {
      return +1;
    }

    return 0;
  }

  return array.slice().sort((a, b) => {
    let value = compare(a, b);
    return direction === 'desc' ? value * -1 : value;
  });
};

module.exports = {
  sortBy
}
