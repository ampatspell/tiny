import Entity, { data, render } from './entity';
import { model } from 'ember-cli-zuglet/lifecycle';

const typed = name => model().named(`project/entities/scene/${name}`).mapping(model => ({ model }))

export default Entity.extend({

  typeName: 'Scene',

  background: data('background'),

  render: render('scene'),

  layers: typed('layers')

});
