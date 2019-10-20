module.exports = array => {
  let addFind = (name, key) => Object.defineProperty(array, name, { value: arg => array.find(model => model[key] === arg )});
  addFind('byIdentifier', 'identifier');
  addFind('byId', 'id');
  return array;
}
