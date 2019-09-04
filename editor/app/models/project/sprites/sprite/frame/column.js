import EmberObject from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { models } from 'ember-cli-zuglet/lifecycle';

export default EmberObject.extend({

  y: null,
  pixels: null,

  _rows: readOnly('pixels._rows'),

  rows: models('_rows').named('project/sprites/sprite/frame/pixel').mapping((x, column) => ({ x, column })),

  toStringExtension() {
    return this.y;
  }

});
