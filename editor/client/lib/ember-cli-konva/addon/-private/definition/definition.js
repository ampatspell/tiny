import EmberObject, { computed } from '@ember/object';
import { A } from '@ember/array';
import { getOwner } from '@ember/application';
import { assert } from '@ember/debug';

export default EmberObject.extend({

  parent: null,
  type: null,
  props: null,

  definitions: computed(function() {
    return A();
  }).readOnly(),

  add(definition) {
    if(!definition) {
      return;
    }
    this.definitions.pushObject(definition);
    return this;
  },

  bind() {
    console.log('bind', 'definition', this.type);
    this.createModel();
  },

  createModel() {
    let { model } = this;
    if(model) {
      return;
    }

    let { parent, type, props, definitions } = this;

    let factory = getOwner(this).factoryFor(`model:${type}`);
    assert(`node model '${type}' is not registered`, !!factory);

    model = factory.create({ definition: this, parent, props });
    definitions.map(definition => definition.bind());

    this.setProperties({ model });
  },

});
