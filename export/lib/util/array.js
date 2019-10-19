const sortBy = (array, key) => {
  let compare = (a, b) => {
    let av = a[key];
    let bv = b[key];
    if(av < bv) {
      return -1;
    }
    if(av > bv) {
      return +1;
    }
    return 0;
  }
  return array.slice().sort(compare);
}

module.exports = {
  sortBy
}
