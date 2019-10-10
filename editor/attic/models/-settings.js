// import Mixin from '@ember/object/mixin';
// import { assign } from '@ember/polyfills';
// import { readOnly, or } from '@ember/object/computed';

// const settings = key => readOnly(`settings.${key}`);

// export default (parentKey, propertyKey) => Mixin.create({

//   settings:  readOnly(`${parentKey}.doc.data.${propertyKey}.serialized`),

//   collapsed: settings('collapsed'),
//   hidden:    settings('hidden'),
//   locked:    settings('locked'),

//   chainHidden: or(`${parentKey}.chainHidden`, 'hidden'),
//   chainLocked: or(`${parentKey}.chainLocked`, 'locked'),

//   update(props) {
//     let settings = assign({}, this.settings, props);
//     this[parentKey].update({ [propertyKey]: settings });
//   }

// });
