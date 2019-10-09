import Entity, { data, render } from './entity';

export default Entity.extend({

  typeName: 'Scene',

  render: render('scene'),

  background: data('background')

});
