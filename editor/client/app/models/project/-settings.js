import Mixin from '@ember/object/mixin';
import { assign } from '@ember/polyfills';
import { readOnly } from '@ember/object/computed';

export default (parentKey, propertyKey) => Mixin.create({

  settings: readOnly(`${parentKey}.doc.data.${propertyKey}.serialized`),

  update(props) {
    let settings = assign({}, this.settings, props);
    this[parentKey].update({ [propertyKey]: settings });
  }

});
