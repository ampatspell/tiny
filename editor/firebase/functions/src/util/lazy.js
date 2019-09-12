//
// class FoobarService {
//   constructor(app) {
//     this.app = app;
//   }
// }
//
// properties(FoobarService, [ 'thingies' ], name => require(`./foobar/${name}`));
//

let defaultValuefn = (value, service, prop) => value(service, prop);

const properties = (factory, props, pathfn, valuefn=defaultValuefn) => props.forEach(prop => {
  let _prop = `_cached_${prop}`;
  Object.defineProperty(factory.prototype, prop, {
    get() {
      let value = this[_prop];
      if(!value) {
        value = pathfn(prop, this);
        value = valuefn(value, this, prop);
        this[_prop] = value;
      }
      return value;
    }
  });
});

module.exports = {
  properties
};
