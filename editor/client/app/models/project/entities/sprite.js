import Entity, { data, render } from './entity';
import { properties } from '../properties';
import { model } from 'ember-cli-zuglet/lifecycle';

const typed = name => model().named(`project/entities/sprite/${name}`).mapping(model => ({ model }))

export default Entity.extend({

  typeName: 'Sprite',

  pixel: data('pixel'),
  background: data('background'),
  properties: properties(),

  render: render('sprite'),

  frames: typed('frames'),
  loops:  typed('loops')

});
