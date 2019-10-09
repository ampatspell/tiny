import Entity, { data, render } from './entity';
import { properties } from '../properties';

export default Entity.extend({

  typeName: 'Sprite',

  pixel: data('pixel'),
  properties: properties(),

  render: render('sprite')

});
