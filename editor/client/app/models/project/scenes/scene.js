import EmberObject from '@ember/object';
import { or } from '@ember/object/computed';
import { model } from 'ember-cli-zuglet/lifecycle';
import DocMixin, { data } from 'editor/models/-doc';
import { properties } from 'editor/models/properties';

export default EmberObject.extend(DocMixin, {

  typeGroup: 'scenes/scene',
  typeName: 'Scene',

  scenes: null,
  doc: null,

  index: data('index'),
  identifier: data('identifier'),
  position: data('position.serialized'),
  size: data('size.serialized'),
  background: data('background'),

  collapsed: data('collapsed'),
  hidden: data('hidden'),
  locked: data('locked'),

  chainHidden: or('scenes.chainHidden', 'hidden'),
  chainLocked: or('scenes.chainLocked', 'locked'),

  properties: properties(),

  layers: model().named('project/scenes/scene/layers').mapping(scene => ({ scene })),

  async load({ type }) {
    if(type === 'detail') {
      await this.layers.load({ type });
    }
  }

});
