const pixels = require('../../../util/pixels');

module.exports = array => {
  
  let addFunction = (name, value) => {
    if(array.hasOwnProperty(name)) {
      return;
    }
    Object.defineProperty(array, name, { value });
  };

  let addGetter = (name, get) => {
    if(array.hasOwnProperty(name)) {
      return;
    }
    Object.defineProperty(array, name, { get });
  }
  
  let addFind = (name, key) => addFunction(name, arg => array.find(model => model[key] === arg ));
  let addFilter = (name, cb) => addGetter(name, () => array.filter(cb));

  addFind('byIdentifier', 'identifier');
  addFind('byId', 'id');
  addFilter('identified', model => !!model.identifier);
  addFunction('toHexStrings', () => pixels.toHexStrings([ ...array ]));

  return array;
}
