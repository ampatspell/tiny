import EmberObject from '@ember/object';
import { model } from 'ember-cli-zuglet/lifecycle';

export const render = name => model().named(`${name}/render`).mapping(model => ({ model }));

export default EmberObject.extend({

  model: null,

  treeComponentName: 'basic'

});
