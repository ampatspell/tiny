const pixels = require('../../../util/pixels');

module.exports = array => {
  
  let addFunction = (name, value) => {
    if(array.hasOwnProperty(name)) {
      return;
    }
    Object.defineProperty(array, name, { value });
  };
  
  let addFind = (name, key) => addFunction(name, arg => array.find(model => model[key] === arg ));

  addFind('byIdentifier', 'identifier');
  addFind('byId', 'id');
  addFunction('toHexStrings', () => pixels.toHexStrings([ ...array ]));

  return array;
}
