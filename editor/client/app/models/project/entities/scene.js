import Entity, { data, render } from './entity';

export default Entity.extend({

  typeName: 'Scene',

  background: data('background'),

  render: render('scene'),

});
