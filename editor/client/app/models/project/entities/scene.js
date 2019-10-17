import Entity, { data, render } from './entity';
import { model } from 'ember-cli-zuglet/lifecycle';
import { assign } from '@ember/polyfills';

const typed = name => model().named(`project/entities/scene/${name}`).mapping(model => ({ model }))

export default Entity.extend({

  typeName: 'Scene',

  background: data('background'),

  render: render('scene'),
  layers: typed('layers'),

  onResize(id, diff) {
    let position = assign({}, this.position);
    let size = assign({}, this.size);

    if(id === 'left') {
      position.x -= diff.x;
    } else if(id === 'top') {
      position.y -= diff.y;
    }

    size.width += diff.x;
    size.height += diff.y;

    if(size.width < 1 || size.height < 1) {
      return false;
    }

    this.layers.onParentResized(id, diff);

    this.update({ position, size });
  }

});
