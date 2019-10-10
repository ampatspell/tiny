import Entity, { data } from '../entity';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { properties } from '../../properties';
import { model } from 'ember-cli-zuglet/lifecycle';

export default Entity.extend({

  typeName: 'Sprite Frame',

  size: readOnly('parent.size'),

  bytes: data('bytes'),

  properties: properties(),
  preview: model().named('project/entities/sprite/frame/preview').mapping(frame => ({ frame })),

  previewRendered: readOnly('preview.rendered'),

  description: computed('index', 'identifier', function() {
    let { index, identifier } = this;
    let arr = [];
    arr.push(`#${index}`);
    if(identifier) {
      arr.push('/', identifier);
    }
    return arr.join(' ');
  }).readOnly()

});
